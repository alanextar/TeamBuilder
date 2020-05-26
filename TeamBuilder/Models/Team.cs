using System.Collections.Generic;
using TeamBuilder.Controllers.Paging;
using TeamBuilder.Models.Enums;

namespace TeamBuilder.Models
{
	public class Team : IDbItem
	{
		public long Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string Link { get; set; }
		public string Photo100 { get; set; }
		public string Photo200 { get; set; }
		public int NumberRequiredMembers { get; set; }
		public string DescriptionRequiredMembers { get; set; }
		public Event Event { get; set; }
		public List<UserTeam> UserTeams { get; set; }
	}

	public class UserTeamDto : IDbItem
	{
		public long Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string Link { get; set; }
		public string Photo100 { get; set; }
		public string Photo200 { get; set; }
		public int NumberRequiredMembers { get; set; }
		public string DescriptionRequiredMembers { get; set; }
		public Event Event { get; set; }
		public bool IsOwner { get; set; }
		public UserActionEnum UserAction { get; set; }
	}
}
