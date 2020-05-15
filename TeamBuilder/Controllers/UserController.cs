using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using TeamBuilder.Models;
using Microsoft.EntityFrameworkCore;

namespace TeamBuilder.Controllers
{
	public class UserController : ControllerBase
	{
		private readonly ApplicationContext context;
		private readonly ILogger<WeatherForecastController> _logger;

		public UserController(ApplicationContext context, ILogger<WeatherForecastController> logger)
		{
			this.context = context;
			_logger = logger;
		}

		public IActionResult Confirm(long vkId)
		{
			_logger.LogInformation("Request ConfirmUser");

			var user = new User(vkId);
			context.Users.Add(user);
			context.SaveChanges();

			return Ok("Confirmed");
		}

		public async Task<User> GetSkills(long id)
		{
			_logger.LogInformation("Request GETALL");

			var user = context.Users.Include(x => x.UserSkills).FirstOrDefault(x => x.Id == id);

			return user;
		}

		public async Task<User> GetTeams(long vkId)
		{
			_logger.LogInformation("Request GETALL");

			var user = context.Users.Include(x => x.UserTeams).FirstOrDefault(x => x.Id == vkId);

			return user;
		}
	}
}