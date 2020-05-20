using System;
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

		public IActionResult PagingSearch(string search, int pageSize = 20, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			if (string.IsNullOrEmpty(search))
				return RedirectToAction("GetPage", new { pageSize, page, prev});

			if (pageSize == 0)
				return NoContent();

			bool Filter(Event @event) => @event.Name.ToLowerInvariant().Contains(search?.ToLowerInvariant() ?? string.Empty);
			var result = context.Events.GetPage(pageSize, HttpContext.Request, page, prev, Filter);
			result.NextHref = result.NextHref == null ? null : $"{result.NextHref}&search={search}";
			logger.LogInformation($"Response EventsCount:{result.Collection.Count()} / from:{result.Collection.FirstOrDefault()?.Id} / " +
			                      $"to:{result.Collection.LastOrDefault()?.Id} / NextHref:{result.NextHref}");

			return Json(result);
		}

		public async Task<IActionResult> GetPage(int pageSize = 20, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			if (!context.Events.Any())
				await Initialize();

			var result = context.Events.GetPage(pageSize, HttpContext.Request, page, prev);
			logger.LogInformation($"Response EventsCount:{result.Collection.Count()} / from:{result.Collection.FirstOrDefault()?.Id} / " +
			                      $"to:{result.Collection.LastOrDefault()?.Id} / NextHref:{result.NextHref}");

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