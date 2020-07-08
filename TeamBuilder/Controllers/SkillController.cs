using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;

namespace TeamBuilder.Controllers
{
	public class SkillController : Controller
	{
		private readonly ApplicationContext context;
		private readonly ILogger<SkillController> logger;

		public SkillController(ApplicationContext context, ILogger<SkillController> logger)
		{
			this.context = context;
			this.logger = logger;
		}

		public IActionResult GetAll()
		{
			logger.LogInformation("Request GETALL");
			var allSkills = context.Skills.ToList();

			return Json(allSkills);
		}
	}
}