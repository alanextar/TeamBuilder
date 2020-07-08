using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
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
	public class TeamsController : Controller
	{
		private readonly ApplicationContext context;
		private readonly UserAccessChecker accessChecker;
		private readonly ILogger<TeamsController> logger;

		public TeamsController(ApplicationContext context, UserAccessChecker accessChecker, ILogger<TeamsController> logger)
		{
			this.context = context;
			this.accessChecker = accessChecker;
			this.logger = logger;
		}

		public IEnumerable<Team> GetAll()
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			var teams = context.Teams.ToList();

			logger.LogInformation($"Response TeamsCount:{teams.Count}");

			return teams;
		}

		public async Task<IActionResult> PagingSearch(string search, long? eventId, int pageSize = 20, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			if (!context.UserTeams.Any())
			{
				logger.LogInformation($"EasterEggs Running");
				await EasterEggs.Eggs(context);
				logger.LogInformation($"EasterEggs Finished");
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

		public IActionResult GetPage(int pageSize = 20, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			if (pageSize == 0)
				return NoContent();

			var teams = context.Teams.Include(x => x.Event).Include(x => x.UserTeams).GetPage(pageSize, HttpContext.Request, page, prev);

			logger.LogInformation($"Response TeamsCount:{teams.Collection.Count()} / from:{teams.Collection.FirstOrDefault()?.Id} / " +
								  $"to:{teams.Collection.LastOrDefault()?.Id} / NextHref:{teams.NextHref}");
			return Json(teams);
		}

		public Team Get(int id)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			var team = context.Teams
				.Include(x => x.Image)
				.Include(x => x.Event)
				.Include(x => x.UserTeams)
				.ThenInclude(x => x.User)
				.FirstOrDefault(t => t.Id == id);

			return team;
		}

		[HttpPost]
		public async Task<IActionResult> Create([FromBody] CreateTeamViewModel createTeamViewModel)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. Body: {JsonConvert.SerializeObject(createTeamViewModel)}");

			if (!accessChecker.IsConfirm(out var profileId))
				return Forbid();

			var @event = await context.Events.FirstOrDefaultAsync(e => e.Id == createTeamViewModel.EventId);

			var image = new Image
			{
				Data = Convert.FromBase64String(createTeamViewModel.imageAsDataUrl.Replace("data:image/jpeg;base64,", "")),
				Title = Guid.NewGuid().ToString()
			};

			var config = new MapperConfiguration(cfg => cfg.CreateMap<CreateTeamViewModel, Team>()
				.ForMember("Event", opt => opt.MapFrom(_ => @event))
				.ForMember("Image", opt => opt.MapFrom(_ => image)));
			var mapper = new Mapper(config);
			var team = mapper.Map<CreateTeamViewModel, Team>(createTeamViewModel);
			team.UserTeams = new List<UserTeam>{
				new UserTeam
				{
					IsOwner = true,
					UserId = profileId
				}};

			await context.Teams.AddAsync(team);
			await context.SaveChangesAsync();

			return Ok(team);
		}

		[HttpPost]
		public async Task<IActionResult> Edit([FromBody] EditTeamViewModel editTeamViewModel)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. Body: {JsonConvert.SerializeObject(editTeamViewModel)}");

			var teamId = editTeamViewModel.Id;
			if (!await accessChecker.CanManageTeam(teamId))
				return Forbid();

			var team = await context.Teams.FirstOrDefaultAsync(t => t.Id == teamId);
			if (team == null)
				return NotFound($"Team '{teamId}' not found");

			var @event = await context.Events.FirstOrDefaultAsync(e => e.Id == editTeamViewModel.EventId);

			var config = new MapperConfiguration(cfg => cfg.CreateMap<EditTeamViewModel, Team>()
				.ForMember("Event", opt => opt.MapFrom(_ => @event)));
			var mapper = new Mapper(config);
			mapper.Map(editTeamViewModel, team);

			context.Update(team);
			await context.SaveChangesAsync();

			return Ok(team);
		}

		[HttpDelete]
		public async Task<IActionResult> Delete(long id)
		{
			logger.LogInformation($"DELETE Request {HttpContext.Request.Headers[":path"]}.");

			if (!await accessChecker.CanManageTeam(id))
				return Forbid();

			var team = await context.Teams.FirstOrDefaultAsync(t => t.Id == id);
			if (team == null)
				return NotFound($"Team '{id}' not found");

			context.Remove(team);
			await context.SaveChangesAsync();

			return Json("Deleted");
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

			return Json(team);
		}

		//Отозвать приглашение которое выслали пользователю
		[HttpPost]
		public async Task<IActionResult> CancelRequestUser([FromBody] ManageUserTeamViewModel model)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. Body: {JsonConvert.SerializeObject(model)}");

			if (!await accessChecker.CanManageTeam(model.TeamId))
				return Forbid();

			var team = await context.Teams
				.Include(u => u.UserTeams)
				.ThenInclude(ut => ut.User)
				.FirstOrDefaultAsync(u => u.Id == model.TeamId);
			var userTeam = team?.UserTeams.FirstOrDefault(ut => ut.UserId == model.UserId);

			if (userTeam == null)
				return NotFound($"Not found User {model.UserId} or user {model.UserId} inside Team {model.TeamId}");

			if (userTeam.UserAction != UserActionEnum.ConsideringOffer)
				throw new Exception($"User '{model.UserId}' have invalid userAction '{userTeam.UserAction}' for team '{model.TeamId}'. " +
									$"Available value: {UserActionEnum.ConsideringOffer}");


			context.Remove(userTeam);
			await context.SaveChangesAsync();

			return Json(team);
		}

		//Добавить пользователя в команду
		[HttpPost]
		public async Task<IActionResult> JoinTeam([FromBody] ManageUserTeamViewModel model)
		{
			logger.LogInformation($"GET Request {HttpContext.Request.Headers[":path"]}");

			if (!await accessChecker.CanManageTeam(model.TeamId))
				return Forbid();

			var user = await context.Users
				.Include(x => x.UserTeams)
				.FirstOrDefaultAsync(u => u.Id == model.UserId);

			var userTeamToJoin = user.UserTeams.First(x => x.TeamId == model.TeamId);

			if (userTeamToJoin.UserAction != UserActionEnum.SentRequest)
				throw new Exception($"User '{model.UserId}' have invalid userAction '{userTeamToJoin.UserAction}' for team '{model.TeamId}'. " +
									$"Available value: {UserActionEnum.SentRequest}");

			userTeamToJoin.UserAction = UserActionEnum.JoinedTeam;

			context.Update(user);
			await context.SaveChangesAsync();

			var updTeam = context.Teams
				.Include(x => x.UserTeams)
				.ThenInclude(y => y.User).FirstOrDefault(x => x.Id == model.TeamId);

			return Json(updTeam);
		}
	}
}