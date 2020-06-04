﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TeamBuilder.Extensions;
using TeamBuilder.Models;
using TeamBuilder.Services;
using TeamBuilder.ViewModels;

namespace TeamBuilder.Controllers
{
	public class EventController : Controller
	{
		private readonly ApplicationContext context;
		private readonly UserAccessChecker accessChecker;
		private readonly ILogger<EventController> logger;

		public EventController(ApplicationContext context, UserAccessChecker accessChecker, ILogger<EventController> logger)
		{
			this.context = context;
			this.accessChecker = accessChecker;
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
			var result = context.Events.Include(e => e.Teams).ThenInclude(t => t.UserTeams).GetPage(pageSize, HttpContext.Request, page, prev, Filter);
			result.NextHref = result.NextHref == null ? null : $"{result.NextHref}&search={search}";
			logger.LogInformation($"Response EventsCount:{result.Collection.Count()} / from:{result.Collection.FirstOrDefault()?.Id} / " +
			                      $"to:{result.Collection.LastOrDefault()?.Id} / NextHref:{result.NextHref}");

			return Json(result);
		}

		public IActionResult GetPage(int pageSize = 20, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			var result = context.Events.Include(e => e.Teams).ThenInclude(t => t.UserTeams).GetPage(pageSize, HttpContext.Request, page, prev);
			logger.LogInformation($"Response EventsCount:{result.Collection.Count()} / from:{result.Collection.FirstOrDefault()?.Id} / " +
			                      $"to:{result.Collection.LastOrDefault()?.Id} / NextHref:{result.NextHref}");

			return Json(result);
		}

		[HttpPost]
		public async Task<IActionResult> Create([FromBody]CreateEventViewModel createEventViewModel)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. Body: {JsonConvert.SerializeObject(createEventViewModel)}"); ;

			if (!accessChecker.IsConfirm(out var profileId))
				return Forbid();

			var config = new MapperConfiguration(cfg => cfg.CreateMap<CreateEventViewModel, Event>()
				.ForMember("Teams", opt => opt.Ignore())
				.ForMember("Owner", opt => opt.Ignore())
				.ForMember("OwnerId", opt => opt.MapFrom(_ => profileId)));
			var mapper = new Mapper(config);
			var @event = mapper.Map<CreateEventViewModel, Event>(createEventViewModel);

			await context.Events.AddAsync(@event);
			await context.SaveChangesAsync();

			return Json(@event);
		}

		[HttpPost]
		public async Task<IActionResult> Edit([FromBody]EditEventViewModel editEventViewModel)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. Body: {JsonConvert.SerializeObject(editEventViewModel)}");

			var eventId = editEventViewModel.Id;
			if (!await accessChecker.CanManageEvent(eventId))
				return Forbid();

			var @event = await context.Events.Include(e => e.Owner).FirstOrDefaultAsync(e => e.Id == eventId);

			var config = new MapperConfiguration(cfg => cfg.CreateMap<EditEventViewModel, Event>()
				.ForMember("Teams", opt => opt.Ignore())
				.ForMember("Owner", opt => opt.Ignore()));
			var mapper = new Mapper(config);
			mapper.Map(editEventViewModel, @event);

			context.Update(@event);
			await context.SaveChangesAsync();

			return Json(@event);
		}

		[HttpDelete]
		public async Task<IActionResult> Delete(long id)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}.");

			var eventId = id;
			if (!await accessChecker.CanManageEvent(eventId))
				return Forbid();

			var @event = await context.Events.FirstOrDefaultAsync(e => e.Id == id);
			if (@event == null)
				return NotFound($"Event '{id}' not found");

			context.Remove(@event);
			await context.SaveChangesAsync();

			return Json("Deleted");
		}
	}
}