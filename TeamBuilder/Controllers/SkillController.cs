using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using TeamBuilder.Models;

namespace TeamBuilder.Controllers
{
	public class SkillController : ControllerBase
	{
		private readonly ApplicationContext context;
		private readonly ILogger<SkillController> _logger;

		public SkillController(ApplicationContext context, ILogger<SkillController> logger)
		{
			this.context = context;
			_logger = logger;
		}

		public async Task<IEnumerable<Skill>> GetAll()
		{
			_logger.LogInformation("Request GETALL");
			if (!context.Teams.Any())
				await Initialize();
			return context.Skills.ToList();
		}

		public async Task<IEnumerable<Skill>> GetUserSkills(long vkId)
		{
			_logger.LogInformation("Request GETALL");
			if (!context.Teams.Any())
				await Initialize();

			var userSkills = context.Skills.Where(x => x.Id == vkId).ToList();

			return userSkills;
		}

		private async Task Initialize()
		{
			var skill1 = new Skill {Name = "C#", Description = "самый лучший язык программирования"};
			var skill2 = new Skill {Name = "python", Description = "самый лучший язык программирования" };
			var skill3 = new Skill {Name = "Django", Description = "самый лучший язык программирования"};
			var skill4 = new Skill {Name = "js", Description = "самый лучший язык программирования"};
			var skill5 = new Skill {Name = "java", Description = "самый лучший язык программирования"};

			await context.Skills.AddRangeAsync(skill1, skill2, skill3, skill4, skill5);
			await context.SaveChangesAsync();
		}
	}
}