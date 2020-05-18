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
				return null;

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

			var team = context.Teams
				.Include(x => x.TeamEvents).ThenInclude(x => x.Event)
				.Include(x => x.UserTeams).ThenInclude(x => x.User)
				.FirstOrDefault(t => t.Id == id);

			return team;
		}

		[HttpPost]
		public async Task<long> Create([FromBody]CreateTeamViewModel createTeamViewModel)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. Body: {JsonConvert.SerializeObject(createTeamViewModel)}");

			var config = new MapperConfiguration(cfg => cfg.CreateMap<CreateTeamViewModel,Team>());
			var mapper = new Mapper(config);
			var team = mapper.Map<CreateTeamViewModel, Team>(createTeamViewModel);

			var newTeam = await context.Teams.AddAsync(team);
			await context.SaveChangesAsync();

			return newTeam.Entity.Id;
		}

		[HttpPost]
		public async Task<long> Edit([FromBody]EditTeamViewModel editTeamViewModel)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. Body: {JsonConvert.SerializeObject(editTeamViewModel)}");

			var config = new MapperConfiguration(cfg => cfg.CreateMap<EditTeamViewModel, Team>());
			var mapper = new Mapper(config);
			var team = mapper.Map<EditTeamViewModel, Team>(editTeamViewModel);

			var editTeam = context.Teams.Update(team);
			await context.SaveChangesAsync();

			return editTeam.Entity.Id;
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