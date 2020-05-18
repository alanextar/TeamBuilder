using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TeamBuilder.Models
{
	public class Team
	{
		public long Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public Event Event { get; set; }
		public List<UserTeam> UserTeams { get; set; }
	}
}
