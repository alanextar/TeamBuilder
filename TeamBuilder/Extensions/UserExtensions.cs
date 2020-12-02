using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TeamBuilder.Models;
using TeamBuilder.Models.Enums;

namespace TeamBuilder.Extensions
{
	public static class UserExtensions
	{
		public static IEnumerable<UserTeam> GetActiveUserTeams(this User user)
		{
			return user.UserTeams.Where(x =>
				x.UserAction == UserActionEnum.ConsideringOffer ||
				x.UserAction == UserActionEnum.JoinedTeam ||
				x.UserAction == UserActionEnum.SentRequest || 
				x.IsOwner);
		}

		public static async Task<long> GetOwnerId(this DbSet<Team> teams, long teamId)
		{
			return (await teams.Include(t => t.UserTeams)
					.FirstOrDefaultAsync(t => t.Id == teamId))
					.UserTeams?
					.FirstOrDefault(t => t.IsOwner)?
					.UserId ?? throw new NullReferenceException("ownerId");
		}
	}
}