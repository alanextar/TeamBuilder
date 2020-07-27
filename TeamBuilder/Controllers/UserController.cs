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
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using TeamBuilder.Hubs;
using TeamBuilder.Services;

namespace TeamBuilder.Controllers
{
	public class UserController : Controller
	{
		private readonly ApplicationContext context;
		private readonly IHubContext<NotificationHub> hubContext;
		private readonly UserAccessChecker accessChecker;
		private readonly ILogger<UserController> logger;

		public UserController(
			ApplicationContext context,
			IHubContext<NotificationHub> hubContext,
			UserAccessChecker accessChecker,
			ILogger<UserController> logger)
		{
			this.context = context;
			this.hubContext = hubContext;
			this.accessChecker = accessChecker;
			this.logger = logger;
		}

		[HttpPost]
		public async Task<IActionResult> SaveOrConfirm([FromBody] ProfileViewModel profileViewModel)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. Body: {JsonConvert.SerializeObject(profileViewModel)}");

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
		
		//TODO не используется
		[HttpGet]
		public IActionResult CheckConfirmation(long id)
		{
			logger.LogInformation($"GET Request {HttpContext.Request.Headers[":path"]}");

			var isConfirmed = context.Users.FirstOrDefault(x => x.Id == id) != null ? true : false;

			return Json(isConfirmed);
		}

		//TODO не используется
		public List<Skill> GetSkills(long id)
		{
			logger.LogInformation($"GET Request {HttpContext.Request.Headers[":path"]}");

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
			logger.LogInformation($"GET Request {HttpContext.Request.Headers[":path"]}");

			var user = context.Users.Include(x => x.UserTeams).FirstOrDefault(x => x.Id == id);

			return user;
		}

		[HttpGet]
		public IActionResult Get(long id)
		{
			logger.LogInformation($"GET Request {HttpContext.Request.Headers[":path"]}");

			var user = context.Users.Include(x => x.UserTeams)
				.ThenInclude(y => y.Team)
				.ThenInclude(y => y.Event)
				.Include(x => x.UserSkills)
				.ThenInclude(y => y.Skill)
				.FirstOrDefault(u => u.Id == id);

			if (user == null)
				return NotFound("Не нашли пользователя");

			if (user?.UserTeams != null)
			{
				user.UserTeams = user.GetActiveUserTeams().ToList();
				user.AnyTeamOwner = user.UserTeams.Any(x => x.IsOwner);
			}

			return Json(user);
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

		[HttpPost]
		public async Task<IActionResult> Edit([FromBody] EditUserViewModel editUserModel)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}");

			if (!await accessChecker.CanManageUser(editUserModel.Id))
				return Forbid();

			var user = await context.Users
				.Include(x => x.UserSkills)
				.FirstOrDefaultAsync(u => u.Id == editUserModel.Id);

			var config = new MapperConfiguration(cfg => cfg.CreateMap<EditUserViewModel, User>());
			var mapper = new Mapper(config);
			mapper.Map(editUserModel, user);

			var existUserSkills = user.UserSkills;
			var newUserSkills = editUserModel.SkillsIds.Select(s => new UserSkill { UserId = user.Id, SkillId = s }).ToList();
			context.TryUpdateManyToMany(existUserSkills, newUserSkills, x => new { x.SkillId });

			context.Update(user);
			await context.SaveChangesAsync();

			//TODO ПОЧЕМУ ПРИХОДИТСЯ ЗАНОВО ДОСТАВАТЬ????
			var updUser = await context.Users
				.Include(x => x.UserTeams)
				.ThenInclude(y => y.Team)
				.ThenInclude(y => y.Event)
				.Include(x => x.UserSkills)
				.ThenInclude(y => y.Skill)
				.FirstOrDefaultAsync(u => u.Id == editUserModel.Id);

			return Json(updUser);
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

			var userTeamToJoin = user?.UserTeams.First(x => x.TeamId == teamId);

			if (userTeamToJoin?.UserAction != UserActionEnum.ConsideringOffer)
				throw new Exception($"User '{user?.Id}' have invalid userAction '{userTeamToJoin?.UserAction}' for team '{teamId}'. " +
									$"Available value: {UserActionEnum.ConsideringOffer}");

			userTeamToJoin.UserAction = UserActionEnum.JoinedTeam;

			context.Update(user);
			await context.SaveChangesAsync();

			var activeUserTeams = user.GetActiveUserTeams();

			return Json(activeUserTeams);
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

			var activeUserTeams = user.GetActiveUserTeams();

			return Json(activeUserTeams);
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

		//Пользователь отправляет запрос в команду из меню команды / Пользователя приглашает команда по кнопке завербовать
		[HttpGet]
		public async Task<IActionResult> SetTeam(long id, long teamId, bool isTeamOffer = true)
		{
			logger.LogInformation("Request SetTeam");

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

			var itemsForNotification = new Dictionary<string, string>
			{
				["TeamId"] = teamId.ToString()
			};
			var notification = new Notification(id, DateTime.Now, "Вас пригласили в команду #team",
				NotifyType.Regular, itemsForNotification);

			await hubContext.Clients.User(id.ToString())
				.SendCoreAsync("notify", new object[] { notification, notification });

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