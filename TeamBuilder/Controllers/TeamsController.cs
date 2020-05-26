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
using TeamBuilder.ViewModels;

namespace TeamBuilder.Controllers
{
	public class TeamsController : Controller
	{
		private readonly ApplicationContext context;
		private readonly ILogger<TeamsController> logger;

		public TeamsController(ApplicationContext context, ILogger<TeamsController> logger)
		{
			this.context = context;
			this.logger = logger;
		}

		public IEnumerable<Team> GetAll()
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			var teams = context.Teams.ToList();

			logger.LogInformation($"Response TeamsCount:{teams.Count}");

			return teams;
		}

		public IActionResult PagingSearch(string search, long? eventId, int pageSize = 20, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			if (pageSize == 0)
				return NoContent();

			bool Filter(Team team)
			{
				var isEqual = team.Name.ToLowerInvariant().Contains(search?.ToLowerInvariant() ?? string.Empty);
				if (eventId != null)
				{
					isEqual = team.Event.Id == eventId && isEqual;
				}
				return isEqual;
			}
			var result = context.Teams.Include(x => x.Event).Include(x => x.UserTeams).GetPage(pageSize, HttpContext.Request, page, prev, Filter);
			result.NextHref = result.NextHref == null ? null : $"{result.NextHref}&search={search}&eventId={eventId}";


			logger.LogInformation($"Response TeamsCount:{result.Collection.Count()} / from:{result.Collection.FirstOrDefault()?.Id} / " +
								  $"to:{result.Collection.LastOrDefault()?.Id} / NextHref:{result.NextHref}");

			return Json(result);
		}

		public async Task<IActionResult> GetPage(int pageSize = 20, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			if (!context.UserTeams.Any())
				await PashalEggs.Eggs(context);

			if (!context.Teams.Any())
				await Initialize();

			if (pageSize == 0)
				return NoContent();

			var teams = context.Teams.Include(x => x.Event).Include(x => x.UserTeams).GetPage(pageSize, HttpContext.Request, page, prev);

			logger.LogInformation($"Response TeamsCount:{teams.Collection.Count()} / from:{teams.Collection.FirstOrDefault()?.Id} / to:{teams.Collection.LastOrDefault()?.Id} / NextHref:{teams.NextHref}");
			return Json(teams);
		}

		public Team Get(int id)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			var team = context.Teams.Include(x => x.Event)
				.Include(x => x.UserTeams).ThenInclude(x => x.User)
				.FirstOrDefault(t => t.Id == id);

			return team;
		}

		[HttpPost]
		public async Task<IActionResult> Create([FromBody]CreateTeamViewModel createTeamViewModel)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. Body: {JsonConvert.SerializeObject(createTeamViewModel)}");

			var @event = await context.Events.FirstOrDefaultAsync(e => e.Id == createTeamViewModel.EventId);

			var config = new MapperConfiguration(cfg => cfg.CreateMap<CreateTeamViewModel, Team>()
				.ForMember("Event", opt => opt.MapFrom(_ => @event)));
			var mapper = new Mapper(config);
			var team = mapper.Map<CreateTeamViewModel, Team>(createTeamViewModel);

			await context.Teams.AddAsync(team);
			await context.SaveChangesAsync();

			return Ok(team);
		}

		[HttpPost]
		public async Task<IActionResult> Edit([FromBody]EditTeamViewModel editTeamViewModel)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. Body: {JsonConvert.SerializeObject(editTeamViewModel)}");

			var team = await context.Teams.FirstOrDefaultAsync(t => t.Id == editTeamViewModel.Id);
			if (team == null)
				return NotFound($"Team '{editTeamViewModel.Id}' not found");

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

			var team = await context.Teams.FirstOrDefaultAsync(t => t.Id == id);
			if (team == null)
				return NotFound($"Team '{id}' not found");

			context.Remove(team);
			await context.SaveChangesAsync();

			return Ok("Deleted");
		}

		[HttpPost]
		public async Task<IActionResult> RejectedOrRemoveUser([FromBody]ManageUserTeamViewModel model)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}");

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
				_ => throw new Exception(
					$"User '{model.UserId}' have invalid userAction '{userTeam.UserAction}' for team '{model.TeamId}'. " +
					$"Available value: {UserActionEnum.RejectedTeamRequest}, {UserActionEnum.QuitTeam}")
			};

			context.Update(userTeam);
			await context.SaveChangesAsync();

			return Json(team.UserTeams);
		}

		[HttpPost]
		public async Task<IActionResult> CancelRequestUser([FromBody]ManageUserTeamViewModel model)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}");

			var team = await context.Teams
				.Include(u => u.UserTeams)
				.ThenInclude(ut => ut.User)
				.FirstOrDefaultAsync(u => u.Id == model.TeamId);
			var userTeam = team?.UserTeams.FirstOrDefault(ut => ut.UserId == model.UserId);

			if (userTeam == null)
				return NotFound($"Not found User {model.UserId} or user {model.UserId} inside Team {model.TeamId}");

			if (userTeam.UserAction != UserActionEnum.ConsideringOffer)
				throw new Exception($"User '{model.UserId}' have invalid userAction '{userTeam.UserAction}' for team '{model.TeamId}'. " +
									$"Available value: {UserActionEnum.RejectedTeamRequest}, {UserActionEnum.QuitTeam}");


			context.Remove(userTeam);
			await context.SaveChangesAsync();

			return Json(team.UserTeams);
		}

		private async Task Initialize()
		{
			var file = await System.IO.File.ReadAllTextAsync(@"DemoDataSets\teams.json");
			var teams = JsonConvert.DeserializeObject<Team[]>(file);
			teams = teams.Select(t =>
			{
				t.NumberRequiredMembers = new Random().Next(0, 15);
				return t;
			}).ToArray();

			await context.Teams.AddRangeAsync(teams);
			await context.SaveChangesAsync();
		}
	}
}