using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using TeamBuilder.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace TeamBuilder.Controllers
{
	public class TeamsController : ControllerBase
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

		public async Task<Page<Team>> GetPage(int pageSize, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			if (!context.Teams.Any())
				await Initialize();

			if (pageSize == 0)
				return new Page<Team>(new List<Team>(), null);

			var countTake = prev ? (page + 1) * pageSize : pageSize ;
			var countSkip = prev ? 0 : page * pageSize;

			string nextHref = null;
			var teams = context.Teams.Skip(countSkip).Take(++countTake).OrderBy(t => t.Id).ToList();
			if (teams.Count == countTake)
			{
				nextHref = $"{HttpContext.Request.Path}?pageSize={pageSize}&page={++page}";
				teams = teams.SkipLast(1).ToList();
			}

			logger.LogInformation($"Response TeamsCount:{teams.Count} / from:{teams.First().Id} / to:{teams.Last().Id} / NextHref:{nextHref}");
			return new Page<Team>(teams, nextHref);
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
			if (@event == null)
				return NotFound($"Event '{createTeamViewModel.EventId}' not found");

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
			if (@event == null)
				return NotFound($"Event '{editTeamViewModel.EventId}' not found");

			var config = new MapperConfiguration(cfg => cfg.CreateMap<EditTeamViewModel, Team>()
				.ForMember("Event", opt => opt.MapFrom(_ => @event)));
			var mapper = new Mapper(config);
			var newTeam = mapper.Map<EditTeamViewModel, Team>(editTeamViewModel);

			context.Teams.Update(newTeam);
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

			context.Teams.Remove(team);
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

	public class CreateTeamViewModel
	{
		public string Name { get; set; }
		public string Description { get; set; }
		public int EventId { get; set; }

		public int NumberRequiredMembers { get; set; }
		public string DescriptionRequiredMembers { get; set; }
	}

	public class EditTeamViewModel
	{
		public long Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public int EventId { get; set; }

		public int NumberRequiredMembers { get; set; }
		public string DescriptionRequiredMembers { get; set; }
	}

	public class Page<T>
	{
		public Page(IEnumerable<T> collection, string nextHref)
		{
			Collection = collection;
			NextHref = nextHref;
		}

		public IEnumerable<T> Collection { get; set; }
		public string NextHref { get; set; }
	}
}