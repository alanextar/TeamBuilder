using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using TeamBuilder.Models;
using Microsoft.EntityFrameworkCore;
using TeamBuilder.DTO;
using TeamBuilder.Extensions;

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
		public IActionResult Confirm([FromBody]ProfileDto userDto)
		{
			_logger.LogInformation("Request ConfirmUser");

			var user = context.Users.Include(x => x.UserSkills)
				.ThenInclude(y => y.Skill).FirstOrDefault(u => u.VkId == userDto.VkId);

			if (user == null)
			{
				user = new User(userDto.VkId);
				user.UserSkills = new List<UserSkill>();
				foreach (var skillId in userDto.SkillsIds)
				{
					user.UserSkills.Add(new UserSkill() { SkillId = skillId });
				}

				context.Users.Add(user);
			}
			else
			{
				var dbUserSkills = user.UserSkills;
				var userSkillsDto = userDto.SkillsIds.Select(s => new UserSkill { UserId = user.Id, SkillId = s }).ToList();
				context.TryUpdateManyToMany(dbUserSkills, userSkillsDto, x => new { x.SkillId });

				context.Users.Update(user);
			}
			
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