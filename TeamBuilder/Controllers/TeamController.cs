using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using TeamBuilder.Models;

namespace TeamBuilder.Controllers
{
	public class TeamController : ControllerBase
	{
		private readonly ApplicationContext context;
		private readonly ILogger<WeatherForecastController> _logger;

		public TeamController(ApplicationContext context, ILogger<WeatherForecastController> logger)
		{
			this.context = context;
			_logger = logger;
		}

		public async Task<IEnumerable<Team>> GetAll()
		{
			_logger.LogInformation("Request GETALL");
			if (!context.Teams.Any())
				await Initialize();
			return context.Teams.ToList();
		}

		public Team Get(int id)
		{
			_logger.LogInformation($"Request GET?id={id}");
			var teams = context.Teams.ToList();
			return teams.FirstOrDefault(t => t.Id == id);
		}

		private async Task Initialize()
		{
			var team1 = new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"};
			var team2 = new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"};
			var team3 = new Team {Name = "Lions MAD Lions", Description = "команда из екб"};
			var team4 = new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"};
			var team5 = new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"};
			var team6 = new Team {Name = "Lions MAD Lions", Description = "команда из екб"};
			var team7 = new Team {Name = "MiBR Made in Brazil", Description = "команда из екб"};
			var team8 = new Team {Name = "Na’Vi Natus Vincere", Description = "команда из екб"};

			await context.Teams.AddRangeAsync(team1, team2, team3, team4, team5, team6, team7, team8);
			await context.SaveChangesAsync();
		}
	}
}