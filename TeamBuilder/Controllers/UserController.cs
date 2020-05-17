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

		[HttpPost]
		public IActionResult Confirm([FromBody]object data)
		{
			_logger.LogInformation("Request ConfirmUser");

			var vkId = Newtonsoft.Json.Linq.JObject.Parse(data.ToString())["vkid"];
			var userSkills = Newtonsoft.Json.Linq.JObject.Parse(data.ToString())["skillsids"];

			var user = new User(1111);
			context.Users.Add(user);
			context.SaveChanges();

			return Ok("Confirmed");
		}

		public List<Skill> GetSkills(long vkId)
		{
			_logger.LogInformation("Request GETSKILLS");

			var userSkills = context.Users.Include(x => x.UserSkills)
				.ThenInclude(y => y.Skill)
				.FirstOrDefault(x => x.VkId == vkId)
				.UserSkills.Select(x => x.Skill).ToList();

			return userSkills;
		}

		public async Task<User> GetTeams(long vkId)
		{
			_logger.LogInformation("Request GETALL");

			var user = context.Users.Include(x => x.UserTeams).FirstOrDefault(x => x.Id == vkId);

			return user;
		}
	}
}