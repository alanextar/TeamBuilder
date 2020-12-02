using System;
using System.Collections.Generic;
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

			if (!await context.UserTeams.AnyAsync())
			{
				logger.LogInformation("EasterEggs Running");
				await EasterEggs.Eggs(context);
				logger.LogInformation("EasterEggs Finished");
			}

			if (pageSize == 0)
				return NoContent();

			bool Filter(Team team)
			{
				var isEqual = team.Name.ToLowerInvariant().Contains(search?.ToLowerInvariant() ?? string.Empty);
				if (eventId != null)
				{
					isEqual = team.EventId == eventId && isEqual;
				}
				return isEqual;
			}
			var result = context.Teams.Include(x => x.Image).Include(x => x.Event).Include(x => x.UserTeams).GetPage(pageSize, HttpContext.Request, page, prev, Filter);
			result.NextHref = result.NextHref == null ? null : $"{result.NextHref}&search={search}&eventId={eventId}";


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
				return Forbid();

			var team = await context.Teams
				.Include(t => t.Image)
				.Include(u => u.UserTeams)
				.ThenInclude(ut => ut.User)
				.FirstOrDefaultAsync(u => u.Id == model.TeamId);
			var userTeam = team?.UserTeams.FirstOrDefault(ut => ut.UserId == model.UserId);

			if (userTeam == null)
				return NotFound($"Not found User {model.UserId} or user {model.UserId} inside Team {model.TeamId}");

			userTeam.UserAction = userTeam.UserAction switch
			{
				UserActionEnum.SentRequest => UserActionEnum.RejectedTeamRequest,
				UserActionEnum.JoinedTeam => UserActionEnum.QuitTeam,
				UserActionEnum.ConsideringOffer => UserActionEnum.RejectedTeamRequest,
				_ => throw new Exception(
					$"User '{model.UserId}' have invalid userAction '{userTeam.UserAction}' for team '{model.TeamId}'. " +
					$"Available value: {UserActionEnum.SentRequest}, {UserActionEnum.JoinedTeam}, {UserActionEnum.ConsideringOffer}")
			};

			context.Update(userTeam);
			await context.SaveChangesAsync();

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
				return NotFound($"Not found User {model.UserId} or user {model.UserId} inside Team {model.TeamId}");

			switch (userTeam.UserAction)
			{
				case UserActionEnum.ConsideringOffer when !await accessChecker.CanManageTeam(model.TeamId):
				case UserActionEnum.SentRequest when !await accessChecker.CanManageTeamOrSelfInTeam(model.TeamId, model.UserId):
					return Forbid();
			}

			if (userTeam.UserAction != UserActionEnum.ConsideringOffer && userTeam.UserAction != UserActionEnum.SentRequest)
				throw new Exception($"User '{model.UserId}' have invalid userAction '{userTeam.UserAction}' for team '{model.TeamId}'. " +
									$"Available value: {UserActionEnum.ConsideringOffer}, {UserActionEnum.SentRequest}");


			context.Remove(userTeam);
			await context.SaveChangesAsync();

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
					return Forbid();
			}

			if (userTeam.UserAction != UserActionEnum.ConsideringOffer && userTeam.UserAction != UserActionEnum.SentRequest)
				throw new Exception($"User '{model.UserId}' have invalid userAction '{userTeam.UserAction}' for team '{model.TeamId}'. " +
									$"Available value: {UserActionEnum.ConsideringOffer}, {UserActionEnum.SentRequest}");

			var wasAction = userTeam.UserAction;
			userTeam.UserAction = UserActionEnum.JoinedTeam;

			context.Update(user);
			await context.SaveChangesAsync();

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