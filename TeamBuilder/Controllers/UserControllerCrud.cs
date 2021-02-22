using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using TeamBuilder.Extensions;
using TeamBuilder.Helpers;
using TeamBuilder.Models;
using TeamBuilder.ViewModels;

namespace TeamBuilder.Controllers
{
	public partial class UserController
	{
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
				var dbUserSkills = user.UserSkills ?? new List<UserSkill> ();
				var userSkillsDto = profileViewModel.SkillsIds
					?.Select(s => new UserSkill { UserId = user.Id, SkillId = s })?.ToList();
				userSkillsDto ??= new List<UserSkill>();

				context.TryUpdateManyToMany(dbUserSkills, userSkillsDto, x => x.SkillId);
			}

			user.FirstName = profileViewModel.FirstName;
			user.LastName = profileViewModel.LastName;
			user.Photo100 = profileViewModel.Photo100;
			user.Photo200 = profileViewModel.Photo200;

			user.IsSearchable = profileViewModel.IsSearchable;

			try
			{
				await context.SaveChangesAsync();
			}
			catch (Exception)
			{
				throw new HttpStatusException(HttpStatusCode.InternalServerError, CommonErrorMessages.SaveChanges);
			}

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
				return Json(null);
			//TODO По идее это правильный эксепшен, но если неподтвержденный юзер, то нужно возвращать null чтобы не вываливался снекбар с exception
			//throw new HttpStatusException(HttpStatusCode.NotFound, UserErrorMessages.NotFound, UserErrorMessages.DebugNotFound(id));

			if (!user.UserTeams.IsNullOrEmpty())
			{
				user.UserTeams = user.GetActiveUserTeams().ToList();
				user.AnyTeamOwner = user.UserTeams.Any(x => x.IsOwner);
			}

			return Json(user);
		}

		public IActionResult GetAll()
		{
			logger.LogInformation($"Request {HttpContext.Request.Headers[":path"]}");

			var users = context.Users.ToList();

			logger.LogInformation($"Response UsersCount:{users.Count}");

			return Json(users);
		}

		[HttpPost]
		public async Task<IActionResult> Edit([FromBody] EditUserViewModel editUserModel)
		{
			logger.LogInformation($"POST Request {HttpContext.Request.Headers[":path"]}");

			if (!await accessChecker.CanManageUser(editUserModel.Id))
				throw new HttpStatusException(HttpStatusCode.Forbidden, CommonErrorMessages.Forbidden);

			var user = await context.Users
				.Include(x => x.UserSkills)
				.FirstOrDefaultAsync(u => u.Id == editUserModel.Id);

			var config = new MapperConfiguration(cfg => cfg.CreateMap<EditUserViewModel, User>());
			var mapper = new Mapper(config);
			mapper.Map(editUserModel, user);

			var existUserSkills = user.UserSkills;
			var newUserSkills = editUserModel.SkillsIds.Select(s => new UserSkill { UserId = user.Id, SkillId = s }).ToList();

			try
			{
				context.TryUpdateManyToMany(existUserSkills, newUserSkills, x => new { x.SkillId });
				context.Update(user);
				await context.SaveChangesAsync();
			}
			catch (Exception)
			{
				throw new HttpStatusException(HttpStatusCode.InternalServerError, CommonErrorMessages.SaveChanges);
			}

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