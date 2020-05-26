using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using TeamBuilder.Controllers.Paging;

namespace TeamBuilder.Models
{
	public class User : IDbItem
	{
		public long Id { get; set; }
		public string FirstName { get; set; }
		public string SecondName { get; set; }
		public string LastName { get; set; }
		public string City { get; set; }
		public string About { get; set; }
		public string Telegram { get; set; }
		public string Email { get; set; }
		public string Mobile { get; set; }
		public string FullName => FirstName + " " + SecondName + " " + LastName;
		public string Photo100 { get; set; }
		public string Photo200 { get; set; }
		public bool IsSearchable { get; set; }
		public bool IsModerator { get; set; }
		//public bool IsConfirmed { get; set; }
		public List<UserTeam> UserTeams { get; set; }
		public List<UserSkill> UserSkills { get; set; }
		public List<Event> OwnEvents { get; set; }

		[NotMapped]
		public List<Team> TeamsToRecruit { get; set; }
		[NotMapped]
		public bool AnyTeamOwner { get; set; }
	}

	public class UserDto : IDbItem
	{
		public long Id { get; set; }
		public string FirstName { get; set; }
		public string SecondName { get; set; }
		public string LastName { get; set; }
		public string City { get; set; }
		public string About { get; set; }
		public string Telegram { get; set; }
		public string Email { get; set; }
		public string Mobile { get; set; }
		public string FullName => FirstName + " " + SecondName + " " + LastName;
		public string Photo100 { get; set; }
		public string Photo200 { get; set; }
		public bool IsSearchable { get; set; }
		public bool IsModerator { get; set; }
		public List<UserTeamDto> UserTeams { get; set; }
		public List<SkillDto> Skills { get; set; }
		public List<Event> OwnEvents { get; set; }
		public List<Team> TeamsToRecruit { get; set; }
		public bool AnyTeamOwner { get; set; }
	}
}
