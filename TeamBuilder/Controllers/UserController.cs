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
		private readonly ILogger<UserController> _logger;

		public UserController(ApplicationContext context, ILogger<UserController> logger)
		{
			this.context = context;
			_logger = logger;
		}

		[HttpPost]
		public IActionResult Confirm(long vkId, List<long> skillIds)
		{
			_logger.LogInformation("Request ConfirmUser");

			var user = new User(vkId);
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