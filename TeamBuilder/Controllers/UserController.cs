﻿using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using TeamBuilder.Models;
using Microsoft.EntityFrameworkCore;
using TeamBuilder.Extensions;
using TeamBuilder.Models.Enums;
using System;
using TeamBuilder.Services;

namespace TeamBuilder.Controllers
{
	public partial class UserController : Controller
	{
		private readonly ApplicationContext context;
		private readonly UserAccessChecker accessChecker;
		private readonly NotificationSender notificationSender;
		private readonly ILogger<UserController> logger;

		public UserController(
			ApplicationContext context,
			UserAccessChecker accessChecker,
			NotificationSender notificationSender,
			ILogger<UserController> logger)
		{
			this.context = context;
			this.accessChecker = accessChecker;
			this.notificationSender = notificationSender;
			this.logger = logger;
		}

		//Команды других могут просматривать все
		public User GetTeams(long id)
		{
			logger.LogInformation($"GET Request {HttpContext.Request.Headers[":path"]}");

			var user = context.Users.Include(x => x.UserTeams).FirstOrDefault(x => x.Id == id);

			return user;
		}

		[HttpGet]
		public async Task<IActionResult> GetRecruitTeams(long vkProfileId, long id)
		{
			logger.LogInformation($"GET Request {HttpContext.Request.Headers[":path"]}");

			var user = await context.Users
				.Include(x => x.UserTeams)
				.ThenInclude(y => y.Team)
				.FirstOrDefaultAsync(u => u.Id == id);

			if (user.IsSearchable)
			{
				var profile = await context.Users
					.Include(x => x.UserTeams)
					.ThenInclude(y => y.Team)
					.FirstOrDefaultAsync(x => x.Id == vkProfileId);

				var profileTeams = profile.UserTeams
					.Where(x => x.IsOwner)
					.Select(x => x.Team)
					.ToList();

				//команды оунера в которых не состоит юзер
				user.TeamsToRecruit = profileTeams.Except(user.GetActiveUserTeams().Select(x => x.Team).ToList()).ToList();
				return Json(user.TeamsToRecruit);
			}

			return BadRequest("Пользователь не ищет команду");
		}

		// Принимает приглашение (из профиля)
		public async Task<IActionResult> JoinTeam(long teamId)
		{
			logger.LogInformation($"GET Request {HttpContext.Request.Headers[":path"]}");

			if (!accessChecker.IsConfirm(out var profileId))
				return Forbid();

			var user = await context.Users
				.Include(x => x.UserTeams)
				.ThenInclude(x => x.Team)
				.ThenInclude(y => y.Event)
				.FirstOrDefaultAsync(u => u.Id == profileId);

			var userTeam = user?.UserTeams.First(x => x.TeamId == teamId);

			if (userTeam?.UserAction != UserActionEnum.ConsideringOffer)
				throw new Exception($"User '{user?.Id}' have invalid userAction '{userTeam?.UserAction}' for team '{teamId}'. " +
									$"Available value: {UserActionEnum.ConsideringOffer}");

			userTeam.UserAction = UserActionEnum.JoinedTeam;

			context.Update(user);
			await context.SaveChangesAsync();

			await JoinTeamNotify(teamId, user, userTeam.Team);

			return Json(user.GetActiveUserTeams());
		}

		//Пользователь выходит из команды / отказывается от приглашения (из профиля)
		public async Task<IActionResult> QuitOrDeclineTeam(long teamId)
		{
			logger.LogInformation($"GET Request {HttpContext.Request.Headers[":path"]}");

			if (!accessChecker.IsConfirm(out var profileId))
				return Forbid();

			var user = await context.Users
				.Include(x => x.UserTeams)
				.ThenInclude(x => x.Team)
				.ThenInclude(y => y.Event)
				.FirstOrDefaultAsync(x => x.Id == profileId);

			var userTeam = user.UserTeams
				.First(y => y.TeamId == teamId);

			userTeam.UserAction = userTeam.UserAction switch
			{
				UserActionEnum.ConsideringOffer => UserActionEnum.RejectedTeamRequest,
				UserActionEnum.JoinedTeam => UserActionEnum.QuitTeam,
				_ => throw new Exception($"User '{profileId}' have invalid userAction '{userTeam.UserAction}' for team '{teamId}'. " +
										 $"Available value: {UserActionEnum.ConsideringOffer}, {UserActionEnum.JoinedTeam}")
			};

			context.Update(user);
			await context.SaveChangesAsync();

			await QuitOrDeclineTeamNotify(teamId, user, userTeam);

			return Json(user.GetActiveUserTeams());
		}

		//Пользователь сам отменяет заявку в команду (из профиля)
		public async Task<IActionResult> CancelRequestTeam(long teamId)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}");

			if (!accessChecker.IsConfirm(out var profileId))
				return Forbid();

			var user = context.Users
				.Include(x => x.UserTeams)
				.ThenInclude(x => x.Team)
				.ThenInclude(y => y.Event)
				.FirstOrDefault(x => x.Id == profileId);
			var userTeam = user?.UserTeams.FirstOrDefault(ut => ut.TeamId == teamId);

			if (userTeam == null)
				return NotFound($"Not found User {profileId} or user {profileId} inside Team {teamId}");

			if (userTeam.UserAction != UserActionEnum.SentRequest)
				throw new Exception($"User '{profileId}' have invalid userAction '{userTeam.UserAction}' for team '{teamId}'. " +
									$"Available value: {UserActionEnum.SentRequest}");

			context.Remove(userTeam);
			await context.SaveChangesAsync();

			var activeUserTeams = user.GetActiveUserTeams();
			return Json(activeUserTeams);
		}

		//Пользователь отправляет запрос в команду из меню команды / Пользователя приглашает команда по кнопке "Завербовать"
		[HttpGet]
		public async Task<IActionResult> SetTeam(long userId, long teamId, bool isTeamOffer = true)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}");

			var dbTeam = await context.Teams
				.Include(x => x.Image)
				.Include(x => x.UserTeams)
				.ThenInclude(x => x.User)
				.Include(x => x.UserTeams)
				.ThenInclude(x => x.Team)
				.ThenInclude(x => x.Event)
				.FirstOrDefaultAsync(x => x.Id == teamId);

			if (dbTeam == null)
				return NotFound();

			var userActionToSet = isTeamOffer
				? UserActionEnum.ConsideringOffer
				: UserActionEnum.SentRequest;

			if (dbTeam.UserTeams.All(x => x.UserId != userId))
			{
				dbTeam.UserTeams.Add(new UserTeam { UserId = userId, UserAction = userActionToSet });
			}
			else
			{
				var user = dbTeam.UserTeams.FirstOrDefault(x => x.UserId == userId);
				user.UserAction = userActionToSet;
			}

			context.Update(dbTeam);
			await context.SaveChangesAsync();

			await SetTeamNotify(userId, dbTeam, userActionToSet);

			return Json(dbTeam);
		}

		#region List

		public IActionResult GetAll()
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			var users = context.Users.ToList();

			logger.LogInformation($"Response UsersCount:{users.Count}");

			return Json(users);
		}

		public IActionResult PagingSearch(string search, int pageSize = 20, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			if (pageSize == 0)
				return NoContent();

			bool Filter(User user) => user.FullName.ToLowerInvariant().Contains(search?.ToLowerInvariant() ?? string.Empty);
			var result = context.Users
				.Include(u => u.UserSkills)
				.ThenInclude(us => us.Skill)
				.Include(u => u.UserTeams)
				.GetPage(pageSize, HttpContext.Request, page, prev, Filter)
				.HackForReferenceLoop();

			result.NextHref = result.NextHref == null ? null : $"{result.NextHref}&search={search}";

			logger.LogInformation($"Response UsersCount:{result.Collection.Count()} / from:{result.Collection.FirstOrDefault()?.Id} / " +
								  $"to:{result.Collection.LastOrDefault()?.Id} / NextHref:{result.NextHref}");

			return Json(result);
		}

		#endregion
	}
}