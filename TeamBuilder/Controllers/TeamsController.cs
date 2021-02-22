using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using TeamBuilder.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TeamBuilder.Extensions;
using TeamBuilder.Models.Enums;
using TeamBuilder.Services;
using TeamBuilder.ViewModels;
using System.Net;
using TeamBuilder.Helpers;

namespace TeamBuilder.Controllers
{
	public partial class TeamsController : Controller
	{
		private readonly ApplicationContext context;
		private readonly UserAccessChecker accessChecker;
		private readonly NotificationSender notificationSender;
		private readonly ILogger<TeamsController> logger;

		public TeamsController(
			ApplicationContext context,
			UserAccessChecker accessChecker,
			NotificationSender notificationSender,
			ILogger<TeamsController> logger)
		{
			this.context = context;
			this.accessChecker = accessChecker;
			this.notificationSender = notificationSender;
			this.logger = logger;
		}

		[Authorize]
		public async Task<IActionResult> PagingSearch(string search, long? eventId, int pageSize = 20, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			if (context.UserTeams.IsNullOrEmpty())
			{
				logger.LogInformation("EasterEggs Running");
				await EasterEggs.Eggs(context);
				logger.LogInformation("EasterEggs Finished");
			}

			if (pageSize == 0)
				throw new HttpStatusException(HttpStatusCode.NoContent, "");

			var searchLower = search?.ToLower();

			var result = context.Teams
				.Where(team => team.Name.ToLower().Contains(searchLower ?? string.Empty) || 
				               team.EventId == eventId)
				.Select(team => new TeamPagingViewModel
				{
					Id = team.Id,
					ImageDataUrl = team.Image.DataURL,
					Description = team.Description,
					Title = team.Name,
					EventName = team.Event.Name,
					CountConfirmedUser = team.UserTeams.Count(u => u.UserAction == UserActionEnum.JoinedTeam || u.IsOwner),
					NumberRequiredMembers = team.NumberRequiredMembers
				})
				.GetPage(pageSize, HttpContext.Request.Headers[":path"], page, prev);
			
			logger.LogInformation($"Response TeamsCount:{result.Collection.Count()} / from:{result.Collection.FirstOrDefault()?.Id} / " +
								  $"to:{result.Collection.LastOrDefault()?.Id} / NextHref:{result.NextHref}");

			return Json(result);
		}

		//Отклонить заявку пользователя / удалить пользователя из команды
		//Пользователь сам удалился в меню команды / Пользователь отклонил приглашение в меню команды
		[HttpPost]
		public async Task<IActionResult> RejectedOrRemoveUser([FromBody] ManageUserTeamViewModel model)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. Body: {JsonConvert.SerializeObject(model)}");

			if (!await accessChecker.CanManageTeamOrSelfInTeam(model.TeamId, model.UserId))
				throw new HttpStatusException(HttpStatusCode.Forbidden, CommonErrorMessages.Forbidden);

			var team = await context.Teams
				.Include(t => t.Image)
				.Include(u => u.UserTeams)
				.ThenInclude(ut => ut.User)
				.FirstOrDefaultAsync(u => u.Id == model.TeamId);
			var userTeam = team?.UserTeams.FirstOrDefault(ut => ut.UserId == model.UserId);

			if (userTeam == null)
				throw new HttpStatusException(HttpStatusCode.NotFound, UserErrorMessages.NotFound, 
					UserErrorMessages.DebugNotFoundUserTeam(model.UserId, model.TeamId));

			userTeam.UserAction = userTeam.UserAction switch
			{
				UserActionEnum.SentRequest => UserActionEnum.RejectedTeamRequest,
				UserActionEnum.JoinedTeam => UserActionEnum.QuitTeam,
				UserActionEnum.ConsideringOffer => UserActionEnum.RejectedTeamRequest,
				_ => throw new HttpStatusException(HttpStatusCode.BadRequest, 
					TeamErrorMessages.QuitDeclineTeam, 
					TeamErrorMessages.InvalidUserAction(model.UserId, userTeam, team.Id, 
					UserActionEnum.SentRequest, UserActionEnum.JoinedTeam, UserActionEnum.ConsideringOffer ))
			};

			//По этому свойству отображается капитан в команде. А так как капитан может самоустраниться, то нужно менять свойство
			userTeam.IsOwner = false;

			try
			{
				context.Update(userTeam);
				await context.SaveChangesAsync();
			}
			catch (Exception)
			{
				throw new HttpStatusException(HttpStatusCode.InternalServerError, CommonErrorMessages.SaveChanges);
			}

			await RejectedOrRemoveUserNotify(model.UserId, team, userTeam.UserAction);

			return Json(team);
		}

		//Отозвать приглашение которое выслали пользователю / пользователь отозвал заявку в команду
		[HttpPost]
		public async Task<IActionResult> CancelRequestUser([FromBody] ManageUserTeamViewModel model)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. Body: {JsonConvert.SerializeObject(model)}");

			var team = await context.Teams
				.Include(t => t.Image)
				.Include(u => u.UserTeams)
				.ThenInclude(ut => ut.User)
				.FirstOrDefaultAsync(u => u.Id == model.TeamId);
			var userTeam = team?.UserTeams.FirstOrDefault(ut => ut.UserId == model.UserId);

			if (userTeam == null)
				throw new HttpStatusException(HttpStatusCode.BadRequest, UserErrorMessages.NotFoundUserTeam, 
					UserErrorMessages.DebugNotFoundUserTeam(model.UserId, model.TeamId));

			switch (userTeam.UserAction)
			{
				case UserActionEnum.ConsideringOffer when !await accessChecker.CanManageTeam(model.TeamId):
				case UserActionEnum.SentRequest when !await accessChecker.CanManageTeamOrSelfInTeam(model.TeamId, model.UserId):
					throw new HttpStatusException(HttpStatusCode.Forbidden, CommonErrorMessages.Forbidden);
			}

			if (userTeam.UserAction != UserActionEnum.ConsideringOffer && userTeam.UserAction != UserActionEnum.SentRequest)
				throw new HttpStatusException(HttpStatusCode.BadRequest,
					TeamErrorMessages.QuitDeclineTeam,
					TeamErrorMessages.InvalidUserAction(model.UserId, userTeam, model.TeamId, 
					UserActionEnum.ConsideringOffer, UserActionEnum.SentRequest));

			try
			{
				context.Remove(userTeam);
				await context.SaveChangesAsync();
			}
			catch (Exception)
			{
				throw new HttpStatusException(HttpStatusCode.InternalServerError, CommonErrorMessages.SaveChanges);
			}

			return Json(team);
		}

		//Добавить пользователя в команду / пользователь принимает приглашение
		[HttpPost]
		public async Task<IActionResult> JoinTeam([FromBody] ManageUserTeamViewModel model)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. Body: {JsonConvert.SerializeObject(model)}");

			var user = await context.Users
				.Include(x => x.UserTeams)
				.FirstOrDefaultAsync(u => u.Id == model.UserId);

			var userTeam = user.UserTeams.First(x => x.TeamId == model.TeamId);

			switch (userTeam.UserAction)
			{
				case UserActionEnum.ConsideringOffer when !await accessChecker.CanManageTeamOrSelfInTeam(model.TeamId, model.UserId):
				case UserActionEnum.SentRequest when !await accessChecker.CanManageTeam(model.TeamId):
					throw new HttpStatusException(HttpStatusCode.Forbidden, CommonErrorMessages.Forbidden);
			}

			var userIsNotAllowedToJoinTeam = userTeam.UserAction != UserActionEnum.ConsideringOffer && 
				userTeam.UserAction != UserActionEnum.SentRequest;

			if (userIsNotAllowedToJoinTeam)
			{
				var debugMsg = TeamErrorMessages.InvalidUserAction(model.UserId, userTeam, model.TeamId, UserActionEnum.SentRequest);

				throw new HttpStatusException(HttpStatusCode.BadRequest, UserErrorMessages.AppendToTeam, debugMsg);
			}

			var wasAction = userTeam.UserAction;
			userTeam.UserAction = UserActionEnum.JoinedTeam;

			try
			{
				context.Update(user);
				await context.SaveChangesAsync();
			}
			catch (Exception)
			{
				throw new HttpStatusException(HttpStatusCode.InternalServerError, CommonErrorMessages.SaveChanges);
			}

			var team = await context.Teams
				.Include(t => t.Image)
				.Include(x => x.UserTeams)
				.ThenInclude(y => y.User)
				.FirstOrDefaultAsync(x => x.Id == model.TeamId);

			await JoinTeamNotify(model.UserId, team, user, wasAction);

			return Json(team);
		}
	}
}