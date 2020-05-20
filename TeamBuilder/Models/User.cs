using System.Collections.Generic;
using TeamBuilder.Controllers.Paging;

namespace TeamBuilder.Models
{
	public class User : IDbItem
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
		public string City { get; set; }
		public string About { get; set; }
		public string FullName => FirstName + " " + SecondName + " " + LastName;
		public bool IsSearchable { get; set; }
		//public bool IsConfirmed { get; set; }
		public List<UserTeam> UserTeams { get; set; }
		public List<UserSkill> UserSkills { get; set; }
		public List<Event> OwnEvents { get; set; }
	}
}
