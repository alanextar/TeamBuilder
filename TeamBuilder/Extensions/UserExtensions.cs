using System.Collections.Generic;
using System.Linq;
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

		public static long? GetOwnerId(this Team team)
		{
			return team.UserTeams?
				.FirstOrDefault(t => t.IsOwner)?
				.UserId;
		}
	}
}