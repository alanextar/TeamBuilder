using System.Collections.Generic;
using System.Linq;
using TeamBuilder.Controllers.Paging;
using TeamBuilder.Models;
using TeamBuilder.Models.Enums;

namespace TeamBuilder.ViewModels
{
	public class TeamPagingViewModel : IHasId, IHasFullName
	{
		public long Id { get; set; }
		public string ImageDataUrl { get; set; }
		public string Description { get; set; }
		public string FullName { get; set; }
		public string EventName { get; set; }
		public int CountConfirmedUser { get; set; }
		public int NumberRequiredMembers { get; set; }

		public static TeamPagingViewModel Create(Team team)
		{
			return new TeamPagingViewModel
			{
				Id = team.Id,
				ImageDataUrl = team.Image.DataURL,
				Description = team.Description,
				FullName = team.Name,
				EventName = team.Event.Name,
				CountConfirmedUser = team.UserTeams.Count(u => u.UserAction == UserActionEnum.JoinedTeam || u.IsOwner),
				NumberRequiredMembers = team.NumberRequiredMembers
			};
		}
	}
}