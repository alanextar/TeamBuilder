using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TeamBuilder.Extensions;
using TeamBuilder.Models;

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

		public async Task<IActionResult> GetPage(int pageSize, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			if (!context.Events.Any())
				await Initialize();

			var result = context.Events.GetPage(pageSize, HttpContext.Request, page, prev);
			logger.LogInformation($"Response TeamsCount:{result.Collection.Count()} / from:{result.Collection?.First().Id} / to:{result.Collection?.Last().Id} / NextHref:{result.NextHref}");

			return Json(result);
		}

		private async Task Initialize()
		{
			var file = await System.IO.File.ReadAllTextAsync(@"DemoDataSets\events.json");
			var events = JsonConvert.DeserializeObject<Event[]>(file);

			await context.Events.AddRangeAsync(events);
			await context.SaveChangesAsync();
		}
	}
}