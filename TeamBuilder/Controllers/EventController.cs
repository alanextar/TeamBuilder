using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using TeamBuilder.Models;
using Microsoft.EntityFrameworkCore;

namespace TeamBuilder.Controllers
{
	public class EventController : Controller
	{
		private readonly ApplicationContext context;
		private readonly ILogger<EventController> logger;

		public EventController(ApplicationContext context, ILogger<EventController> logger)
		{
			this.context = context;
			this.logger = logger;
		}

		
		
		public IActionResult GetAll()
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			var events = context.Events.ToList();

			return Json(events);
		}

	}

}