using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TeamBuilder.Models
{
	public class User
	{
		public User()
		{

		}

		public User(long vkId)
		{
			VkId = vkId;
		}

		public long Id { get; set; }
		public long VkId { get; set; }
		public string FirstName { get; set; }
		public string SecondName { get; set; }
		public string LastName { get; set; }
		public string FullName => FirstName + " " + SecondName + " " + LastName;
		public bool IsAvailableForSearch { get; set; }
		public List<UserTeam> UserTeams { get; set; }
		public List<UserSkill> UserSkills { get; set; }
	}
}
