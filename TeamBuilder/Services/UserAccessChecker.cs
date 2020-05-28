using System.Linq;
using System.Net;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using TeamBuilder.Extensions;
using TeamBuilder.Models.Other;
using System;
using Microsoft.Extensions.Logging;

namespace TeamBuilder.Services
{
	public class UserAccessChecker
	{
		private readonly ApplicationContext context;
		private readonly IHttpContextAccessor httpContextAccessor;
		private readonly ILogger<UserAccessChecker> logger;

		public UserAccessChecker(ApplicationContext context, IHttpContextAccessor httpContextAccessor, ILogger<UserAccessChecker> logger)
		{
			this.context = context;
			this.httpContextAccessor = httpContextAccessor;
			this.logger = logger;
		}

		public bool IsConfirm(out long profileId)
		{
			profileId = long.MinValue;
			try
			{
				profileId = httpContextAccessor.HttpContext.VkLaunchParams().VkUserId;
				var l = profileId;
				return context.Users.FirstOrDefault(u => u.Id == l) != null;
			}
			catch (Exception e)
			{
				logger.LogWarning($"Exception on access checker for user id '{profileId}'. Details: {e}");
				return false;
			}
		}

		internal async Task<bool> CanManageTeam(long teamId)
		{
			var profileId = httpContextAccessor.HttpContext.VkLaunchParams().VkUserId;
			var user = await context.Users.Include(u => u.UserTeams).FirstOrDefaultAsync(u => u.Id == profileId);

			if (user == null)
				return false;

			var userTeam = user.UserTeams.FirstOrDefault(ut => ut.TeamId == teamId);

			var isOwner = userTeam?.IsOwner ?? false;
			var isModerator = user.IsModerator;

			return isOwner || isModerator;
		}

		internal async Task<bool> CanManageEvent(long eventId)
		{
			var profileId = httpContextAccessor.HttpContext.VkLaunchParams().VkUserId;
			var user = await context.Users.Include(u => u.OwnEvents).FirstOrDefaultAsync(u => u.Id == profileId);

			if (user == null)
				return false;

			var @event = user.OwnEvents.FirstOrDefault(e => e.Id == eventId);

			var isOwner = @event != null;
			var isModerator = user.IsModerator;

			return isOwner || isModerator;
		}
	}
}