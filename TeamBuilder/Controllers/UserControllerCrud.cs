using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using TeamBuilder.Extensions;
using TeamBuilder.Models;
using TeamBuilder.ViewModels;

namespace TeamBuilder.Controllers
{
	public partial class UserController
	{
		[HttpPost]
		public async Task<IActionResult> SaveOrConfirm([FromBody] ProfileViewModel profileViewModel)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}. " +
			                      $"Body: {JsonConvert.SerializeObject(profileViewModel)}");

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
	}
}