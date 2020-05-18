using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using TeamBuilder.Models;
using Microsoft.EntityFrameworkCore;

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

		public async Task<Page<Team>> GetPage(int pageSize, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request teams/GetPage?pageSize={pageSize}&page={page}");

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
				nextHref = $"teams/GetPage?pageSize={pageSize}&page={++page}";
				teams = teams.SkipLast(1).ToList();
			}

			logger.LogInformation($"Response TeamsCount:{teams.Count} / from:{teams.First().Id} / to:{teams.Last().Id} / NextHref:{nextHref}");
			return new Page<Team>(teams, nextHref);
		}
		
		public Team Get(int id)
		{
			logger.LogInformation($"Request teams/GET?id={id}");

			var team = context.Teams.Include(x => x.TeamEvents)
				.ThenInclude(x => x.Event).FirstOrDefault(t => t.Id == id);

			return team;
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