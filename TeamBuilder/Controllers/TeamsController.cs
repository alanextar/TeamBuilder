using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using TeamBuilder.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TeamBuilder.Dto;
using TeamBuilder.Extensions;
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

		public IActionResult PagingSearch(string search, int pageSize = 20, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			if (pageSize == 0)
				return NoContent();

			bool Filter(Team team) => team.Name.ToLowerInvariant().Contains(search?.ToLowerInvariant() ?? string.Empty);
			var result = context.Teams.Include(x => x.Event).Include(x => x.UserTeams).GetPage(pageSize, HttpContext.Request, page, prev, Filter);
			logger.LogInformation($"Response EventsCount:{result.Collection.Count()} / from:{result.Collection.FirstOrDefault()?.Id} / " +
			                      $"to:{result.Collection.LastOrDefault()?.Id} / NextHref:{result.NextHref}");

			return Json(result);
		}

		public async Task<IActionResult> GetPage(int pageSize = 20, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

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

			var config = new MapperConfiguration(cfg => cfg.CreateMap<CreateTeamViewModel,Team>()
				.ForMember("Event", opt => opt.MapFrom(_ => @event)));
			var mapper = new Mapper(config);
			var team = mapper.Map<CreateTeamViewModel, Team>(createTeamViewModel);

			await context.Teams.AddAsync(team);
			await context.SaveChangesAsync();

			return Ok("Created");
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

			return Ok("Updated");
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

		private async Task Initialize()
		{
			var teams = new List<Team>
			{
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Lions MAD Lions", Description = "команда из екб"},
				new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"},
				new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"},
			};

			await context.Teams.AddRangeAsync(teams);
			await context.SaveChangesAsync();
		}
	}
}