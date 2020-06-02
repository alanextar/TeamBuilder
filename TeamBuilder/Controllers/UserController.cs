using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using TeamBuilder.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TeamBuilder.Extensions;
using TeamBuilder.Models.Enums;
using TeamBuilder.ViewModels;
using System;
using TeamBuilder.Services;

namespace TeamBuilder.Controllers
{
	public class UserController : Controller
	{
		private readonly ApplicationContext context;
		private readonly UserAccessChecker accessChecker;
		private readonly ILogger<UserController> logger;

		public UserController(ApplicationContext context, UserAccessChecker accessChecker, ILogger<UserController> logger)
		{
			this.context = context;
			this.accessChecker = accessChecker;
			this.logger = logger;
		}

		[HttpPost]
		public async Task<IActionResult> SaveOrConfirm([FromBody]ProfileViewModel profileViewModel)
		{
			logger.LogInformation($"POST Request Confirm. Body: {JsonConvert.SerializeObject(profileViewModel)}");

			var user = context.Users.Include(x => x.UserSkills)
				.ThenInclude(y => y.Skill).FirstOrDefault(u => u.Id == profileViewModel.Id);

			if (user == null)
			{
				user = new User { Id = profileViewModel.Id };
				if (profileViewModel.SkillsIds != null)
				{
					foreach (var skillId in profileViewModel.SkillsIds)
					{
						user.UserSkills.Add(new UserSkill() { SkillId = skillId });
					}
				}

				await context.Users.AddAsync(user);
			}
			else
			{
				var dbUserSkills = user.UserSkills;
				var userSkillsDto = profileViewModel.SkillsIds.Select(s => new UserSkill { UserId = user.Id, SkillId = s }).ToList();
				context.TryUpdateManyToMany(dbUserSkills, userSkillsDto, x => new { x.SkillId });

				context.Users.Update(user);
			}

			user.FirstName = profileViewModel.FirstName;
			user.LastName = profileViewModel.LastName;
			user.Photo100 = profileViewModel.Photo100;
			user.Photo200 = profileViewModel.Photo200;

			user.IsSearchable = profileViewModel.IsSearchable;

			await context.SaveChangesAsync();

			return Json(user);
		}

		[HttpGet]
		public IActionResult CheckConfirmation(long id)
		{
			logger.LogInformation($"Request CheckConfirmation/{id}");

			var isConfirmed = context.Users.FirstOrDefault(x => x.Id == id) != null ? true : false;

			return Json(isConfirmed);
		}

		//TODO не используется
		public List<Skill> GetSkills(long id)
		{
			logger.LogInformation($"Request GetSkills/{id}");

			var userSkills = context.Users.Include(x => x.UserSkills)
				.ThenInclude(y => y.Skill)
				.FirstOrDefault(x => x.Id == id)?
				.UserSkills
				.Select(x => x.Skill)
				.ToList();

			if (userSkills == null || !userSkills.Any())
				return new List<Skill>();

			return userSkills;
		}

		//Команды других могут просматривать все
		public User GetTeams(long id)
		{
			logger.LogInformation($"Request GetTeams/{id}");

			var user = context.Users.Include(x => x.UserTeams).FirstOrDefault(x => x.Id == id);

			return user;
		}

		[HttpGet]
		public IActionResult Get(long id)
		{
			logger.LogInformation($"Request Get/{id}");

			var user = context.Users.Include(x => x.UserTeams)
				.ThenInclude(y => y.Team)
				.ThenInclude(y => y.Event)
				.Include(x => x.UserSkills)
				.ThenInclude(y => y.Skill)
				.FirstOrDefault(u => u.Id == id);

			if (user?.UserTeams != null)
			{
				user.UserTeams = user.UserTeams.Where(x => x.UserAction == UserActionEnum.ConsideringOffer ||
				x.UserAction == UserActionEnum.JoinedTeam ||
				x.UserAction == UserActionEnum.SentRequest || x.IsOwner).ToList();

				user.AnyTeamOwner = user.UserTeams.Any(x => x.IsOwner);
			}

			return Json(user);
		}

		[HttpGet]
		public IActionResult GetRecruitTeams(long vkProfileId, long id)
		{
			logger.LogInformation($"Request GetRecruitTeams/?vkProfielId={vkProfileId}&id={id}");

			var user = context.Users.Include(x => x.UserTeams)
				.ThenInclude(y => y.Team)
				.ThenInclude(y => y.Event)
				.FirstOrDefault(u => u.Id == id);

			if (user.IsSearchable)
			{
				var profileTeams = context.Users.Include(x => x.UserTeams)
				.ThenInclude(y => y.Team).SelectMany(x => x.UserTeams)
				.Where(x => x.IsOwner && x.UserId == vkProfileId).Select(x => x.Team).ToList();

				//команды оунера в которых не состоит юзер
				user.TeamsToRecruit = profileTeams.Except(user.UserTeams.Select(x => x.Team).ToList()).ToList();
			}

			return Json(user.TeamsToRecruit);
		}

		[HttpPost]
		public async Task<IActionResult> Edit([FromBody]User user)
		{
			logger.LogInformation("Request Edit");

			if (!await accessChecker.CanManageUser(user.Id))
				return Forbid();

			var dbUser = context.Users.FirstOrDefault(u => u.Id == user.Id);
			dbUser.Mobile = user.Mobile;
			dbUser.Email = user.Email;
			dbUser.About = user.About;
			dbUser.Telegram = user.Telegram;

			context.Update(dbUser);
			await context.SaveChangesAsync();

			return Json(dbUser);
		}

		public async Task<IActionResult> JoinTeam(long teamId)
		{
			logger.LogInformation("Request JoinTeamm");

			if (!accessChecker.IsConfirm(out var profileId))
				return Forbid();
			
			var user = context.Users
				.Include(x => x.UserTeams)
				.ThenInclude(x => x.Team)
				.ThenInclude(y => y.Event)
				.FirstOrDefault(u => u.Id == profileId);

			var userTeamToJoin = user.UserTeams.First(x => x.TeamId == teamId);

			if (userTeamToJoin.UserAction != UserActionEnum.ConsideringOffer)
				throw new Exception($"User '{user.Id}' have invalid userAction '{userTeamToJoin.UserAction}' for team '{teamId}'. " +
				                    $"Available value: {UserActionEnum.ConsideringOffer}");

			userTeamToJoin.UserAction = UserActionEnum.JoinedTeam;

			context.Update(user);
			await context.SaveChangesAsync();

			var activeUserTeams = user.UserTeams.Where(x => x.UserAction == UserActionEnum.ConsideringOffer ||
				x.UserAction == UserActionEnum.JoinedTeam ||
				x.UserAction == UserActionEnum.SentRequest || x.IsOwner);

			return Json(activeUserTeams);
		}

		//Пользователь выходит из команды / отказывается от приглашения из меню профиля
		public async Task<IActionResult> QuitOrDeclineTeam(long teamId)
		{
			logger.LogInformation("Request JoinTeamm");

			if (!accessChecker.IsConfirm(out var profileId))
				return Forbid();

			var user = context.Users
				.Include(x => x.UserTeams)
				.ThenInclude(x => x.Team)
				.ThenInclude(y => y.Event)
				.FirstOrDefault(x => x.Id == profileId);

			var userTeam = user.UserTeams
				.First(y => y.TeamId == teamId);

			userTeam.UserAction = userTeam.UserAction switch
			{
				UserActionEnum.ConsideringOffer => UserActionEnum.RejectedTeamRequest,
				UserActionEnum.JoinedTeam => UserActionEnum.QuitTeam,
				_ => throw new Exception($"User '{profileId}' have invalid userAction '{userTeam.UserAction}' for team '{teamId}'. " +
										 $"Available value: {UserActionEnum.ConsideringOffer}, {UserActionEnum.JoinedTeam}")
			};

			await context.SaveChangesAsync();

			var activeUserTeams = user.UserTeams.Where(x => x.UserAction == UserActionEnum.ConsideringOffer ||
				x.UserAction == UserActionEnum.JoinedTeam ||
				x.UserAction == UserActionEnum.SentRequest || x.IsOwner);

			return Json(activeUserTeams);
		}

		//Пользователь сам отменяет заявку в команду
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

			var activeUserTeams = user.UserTeams
				.Where(x => x.UserAction == UserActionEnum.ConsideringOffer ||
							x.UserAction == UserActionEnum.JoinedTeam ||
							x.UserAction == UserActionEnum.SentRequest || x.IsOwner);
			return Json(activeUserTeams);
		}

		//TODO Не понял что тут происходит :) 
		//Пользователь отправляет запрос в команду из меню команды / Пользователя приглашает команда по кнопке завербовать
		[HttpGet]
		public async Task<IActionResult> SetTeam(long id, long teamId, bool isTeamOffer = true)
		{
			logger.LogInformation("Request SetTeam");

			var dbTeam = context.Teams.Include(x => x.UserTeams).ThenInclude(x => x.User).FirstOrDefault(x => x.Id == teamId);
			if (dbTeam == null)
				return NotFound();

			var userActionToSet = isTeamOffer ?
					UserActionEnum.ConsideringOffer : UserActionEnum.SentRequest;

			if (dbTeam.UserTeams.All(x => x.UserId != id))
			{
				dbTeam.UserTeams.Add(new UserTeam { UserId = id, UserAction = userActionToSet });
			}
			else
			{
				var user = dbTeam.UserTeams.FirstOrDefault(x => x.UserId == id);
				user.UserAction = userActionToSet;
			}

			context.Update(dbTeam);
			await context.SaveChangesAsync();

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

			if (string.IsNullOrEmpty(search))
				return RedirectToAction("GetPage", new { pageSize, page, prev });

			if (pageSize == 0)
				return NoContent();

			bool Filter(User user) => user.FullName.ToLowerInvariant().Contains(search?.ToLowerInvariant());
			var result = context.Users
				.Include(u => u.UserSkills).ThenInclude(us => us.Skill)
				.Include(u => u.UserTeams).ThenInclude(ut => ut.Team)
				.GetPage(pageSize, HttpContext.Request, page, prev, Filter)
				.HackForReferenceLoop();

			result.NextHref = result.NextHref == null ? null : $"{result.NextHref}&search={search}";

			logger.LogInformation($"Response UsersCount:{result.Collection.Count()} / from:{result.Collection.FirstOrDefault()?.Id} / " +
								  $"to:{result.Collection.LastOrDefault()?.Id} / NextHref:{result.NextHref}");

			return Json(result);
		}

		public IActionResult GetPage(int pageSize = 20, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			if (pageSize == 0)
				return NoContent();

			var result = context.Users
				.Include(u => u.UserSkills).ThenInclude(us => us.Skill)
				.Include(u => u.UserTeams).ThenInclude(ut => ut.Team)
				.GetPage(pageSize, HttpContext.Request, page, prev)
				.HackForReferenceLoop();

			logger.LogInformation($"Response UsersCount:{result.Collection.Count()} / from:{result.Collection.FirstOrDefault()?.Id} / " +
									  $"to:{result.Collection.LastOrDefault()?.Id} / NextHref:{result.NextHref}");
			return Json(result);
		}

		#endregion
	}
}