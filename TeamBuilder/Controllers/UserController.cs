using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using TeamBuilder.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TeamBuilder.Extensions;
using TeamBuilder.ViewModels;

namespace TeamBuilder.Controllers
{
	public class UserController : Controller
	{
		private readonly ApplicationContext context;
		private readonly ILogger<UserController> logger;

		public UserController(ApplicationContext context, ILogger<UserController> logger)
		{
			this.context = context;
			this.logger = logger;
		}

		[HttpPost]
		public async Task<IActionResult> Confirm([FromBody]ProfileViewModel profileViewModel)
		{
			logger.LogInformation($"POST Request Confirm. Body: {JsonConvert.SerializeObject(profileViewModel)}");

			var user = context.Users.Include(x => x.UserSkills)
				.ThenInclude(y => y.Skill).FirstOrDefault(u => u.VkId == profileViewModel.VkId);

			if (user == null)
			{
				user = new User(profileViewModel.VkId);
				user.UserSkills = new List<UserSkill>();
				foreach (var skillId in profileViewModel.SkillsIds)
				{
					user.UserSkills.Add(new UserSkill() { SkillId = skillId });
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

			user.IsSearchable = profileViewModel.IsSearchable;
			
			await context.SaveChangesAsync();

			return Ok("Confirmed");
		}

		[HttpGet]
		public IActionResult CheckConfirmation(long vkId)
		{
			logger.LogInformation($"Request CheckConfirmation/{vkId}");

			var isConfirmed = context.Users.FirstOrDefault(x => x.VkId == vkId) != null ? true : false;

			return Json(isConfirmed);
		}

		public List<Skill> GetSkills(long vkId)
		{
			logger.LogInformation($"Request GetSkills/{vkId}");

			var userSkills = context.Users.Include(x => x.UserSkills)
				.ThenInclude(y => y.Skill)
				.FirstOrDefault(x => x.VkId == vkId)?
				.UserSkills
				.Select(x => x.Skill)
				.ToList();

			if (userSkills == null || !userSkills.Any())
				return new List<Skill>();

			return userSkills;
		}

		public User GetTeams(long vkId)
		{
			logger.LogInformation($"Request GetTeams/{vkId}");

			var user = context.Users.Include(x => x.UserTeams).FirstOrDefault(x => x.Id == vkId);

			return user;
		}

		[HttpGet]
		public IActionResult Get(long vkId)
		{
			logger.LogInformation("Request ConfirmUser");

			var user = context.Users.Include(x => x.UserTeams)
				.ThenInclude(y => y.Team)
				.ThenInclude(y => y.Event)
				.Include(x => x.UserSkills)
				.ThenInclude(y => y.Skill)
				.FirstOrDefault(u => u.VkId == vkId);

			return Json(user);
		}

		[HttpPost]
		public IActionResult Edit([FromBody]User user)
		{
			logger.LogInformation("Request ConfirmUser");

			var dbUser = context.Users.FirstOrDefault(u => u.VkId == user.VkId);
			dbUser.City = user.City;
			dbUser.About = user.About;

			context.Update(dbUser);
			context.SaveChanges();

			return Ok("Saved");
		}

		public IActionResult JoinTeam(long id, long teamId)
		{
			logger.LogInformation("Request JoinTeamm");

			var dbUser = context.Users
				.Include(x => x.UserTeams)
				.ThenInclude(x => x.Team)
				.ThenInclude(y => y.Event)
				.FirstOrDefault(u => u.Id == id);

			var userTeamToJoin = dbUser.UserTeams.First(x => x.TeamId == teamId);
			userTeamToJoin.UserAction = UserActionEnum.JoinedTeam;

			context.Update(dbUser);
			context.SaveChanges();

			return Json(dbUser.UserTeams);
		}

		public IActionResult QuitOrDeclineTeam(long id, long teamId)
		{
			logger.LogInformation("Request JoinTeamm");

			var dbUser = context.Users
				.Include(x => x.UserTeams)
				.ThenInclude(x => x.Team)
				.ThenInclude(y => y.Event);

			var userTeams = dbUser
				.SelectMany(x => x.UserTeams);

			var userTeamToDelete = userTeams
				.First(y => y.TeamId == teamId && y.UserId == id);

			context.UserTeams.Remove(userTeamToDelete);
			context.SaveChanges();

			return Json(userTeams);
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
				return RedirectToAction("GetPage", new { pageSize, page, prev});

			if (pageSize == 0)
				return NoContent();

			bool Filter(User user) => user.FullName.ToLowerInvariant().Contains(search?.ToLowerInvariant());
			var result = context.Users
				.Include(u => u.UserSkills).ThenInclude(us => us.Skill)
				.Include(u => u.UserTeams).ThenInclude(ut => ut.Team)
				.GetPage(pageSize, HttpContext.Request, page, prev, Filter);
			result.NextHref = result.NextHref == null ? null : $"{result.NextHref}&search={search}";
			logger.LogInformation($"Response UsersCount:{result.Collection.Count()} / from:{result.Collection.FirstOrDefault()?.Id} / " +
			                      $"to:{result.Collection.LastOrDefault()?.Id} / NextHref:{result.NextHref}");

			return Json(result);
		}

		public IActionResult GetPage(int pageSize = 20, int page = 0, bool prev = false)
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			//if (!context.Teams.Any())
			//	await Initialize();

			if (pageSize == 0)
				return NoContent();

			var result = context.Users
				.Include(u => u.UserSkills).ThenInclude(us => us.Skill)
				.Include(u => u.UserTeams).ThenInclude(ut => ut.Team)
				.GetPage(pageSize, HttpContext.Request, page, prev);

			logger.LogInformation($"Response UsersCount:{result.Collection.Count()} / from:{result.Collection.FirstOrDefault()?.Id} / to:{result.Collection.LastOrDefault()?.Id} / NextHref:{result.NextHref}");
			return Json(result);
		}

		#endregion
	}
}