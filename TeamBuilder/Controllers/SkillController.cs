using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using TeamBuilder.Models;

namespace TeamBuilder.Controllers
{
	public class SkillController : Controller
	{
		private readonly ApplicationContext context;
		private readonly ILogger<SkillController> _logger;

		public SkillController(ApplicationContext context, ILogger<SkillController> logger)
		{
			this.context = context;
			_logger = logger;
		}

		public IActionResult GetAll()
		{
			_logger.LogInformation("Request GETALL");
			var allSkills = context.Skills.ToList();

			return Json(allSkills);
		}
	}
}