using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using TeamBuilder.Models;
using TeamBuilder.ViewModels;

namespace TeamBuilder.Controllers
{
	public partial class TeamsController
	{
		public Team Get(int id)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			var team = context.Teams
				.Include(x => x.Image)
				.Include(x => x.Event)
				.Include(x => x.UserTeams)
				.ThenInclude(x => x.User)
				.FirstOrDefault(t => t.Id == id);

			return team;
		}

		public IEnumerable<Team> GetAll()
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			var teams = context.Teams.ToList();

			logger.LogInformation($"Response TeamsCount:{teams.Count}");

			return teams;
		}

		[HttpPost]
		public async Task<IActionResult> Create([FromBody] CreateTeamViewModel createTeamViewModel)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. " +
			                      $"Body: {JsonConvert.SerializeObject(createTeamViewModel)}");

			if (!accessChecker.IsConfirm(out var profileId))
				return Forbid();

			var teamsNames = await context.Teams.Select(t => t.Name).ToListAsync();

			if (teamsNames.Contains(createTeamViewModel.Name))
				return BadRequest("Команда с таким именем уже существует");

			var @event = await context.Events.FirstOrDefaultAsync(e => e.Id == createTeamViewModel.EventId);

			var image = new Image
			{
				Data = Convert.FromBase64String(createTeamViewModel.imageAsDataUrl.Replace("data:image/jpeg;base64,", "")),
				Title = Guid.NewGuid().ToString()
			};

			var config = new MapperConfiguration(cfg => cfg.CreateMap<CreateTeamViewModel, Team>()
				.ForMember("Event", opt => opt.MapFrom(_ => @event))
				.ForMember("Image", opt => opt.MapFrom(_ => image)));
			var mapper = new Mapper(config);
			var team = mapper.Map<CreateTeamViewModel, Team>(createTeamViewModel);
			team.UserTeams = new List<UserTeam>{
				new UserTeam
				{
					IsOwner = true,
					UserId = profileId
				}};

			await context.Teams.AddAsync(team);
			await context.SaveChangesAsync();

			return Ok(team);
		}

		[HttpPost]
		public async Task<IActionResult> Edit([FromBody] EditTeamViewModel editTeamViewModel)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. " +
			                      $"Body: {JsonConvert.SerializeObject(editTeamViewModel)}");

			var teamId = editTeamViewModel.Id;
			if (!await accessChecker.CanManageTeam(teamId))
				return Forbid();

			var team = await context.Teams.FirstOrDefaultAsync(t => t.Id == teamId);
			if (team == null)
				return NotFound($"Team '{teamId}' not found");

			var @event = await context.Events.FirstOrDefaultAsync(e => e.Id == editTeamViewModel.EventId);

			var config = new MapperConfiguration(cfg => cfg.CreateMap<EditTeamViewModel, Team>()
				.ForMember("Event", opt => opt.MapFrom(_ => @event)));
			var mapper = new Mapper(config);
			mapper.Map(editTeamViewModel, team);

			context.Update(team);
			await context.SaveChangesAsync();

			return Ok(team);
		}

		[HttpDelete]
		public async Task<IActionResult> Delete(long id)
		{
			logger.LogInformation($"DELETE Request {HttpContext.Request.Headers[":path"]}.");

			if (!await accessChecker.CanManageTeam(id))
				return Forbid();

			var team = await context.Teams.FirstOrDefaultAsync(t => t.Id == id);
			if (team == null)
				return NotFound($"Team '{id}' not found");

			context.Remove(team);
			await context.SaveChangesAsync();

			return Json("Deleted");
		}
	}
}