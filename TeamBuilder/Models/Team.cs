using System.Collections.Generic;

namespace TeamBuilder.Models
{
	public class Team
	{
		public long Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string Link { get; set; }
		public int NumberRequiredMembers { get; set; }
		public string DescriptionRequiredMembers { get; set; }
		public Event Event { get; set; }
		public List<UserTeam> UserTeams { get; set; }
		public User Owner { get; set; }
	}
}
