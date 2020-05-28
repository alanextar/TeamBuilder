using System.Collections.Generic;

namespace TeamBuilder.ViewModels
{
	public class ProfileViewModel
	{
		public long Id { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public List<long> SkillsIds { get; set; }
		public bool IsSearchable { get; set; }
		public string Photo100 { get; set; }
		public string Photo200 { get; set; }
	}
}