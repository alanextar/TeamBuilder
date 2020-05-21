using System.Collections.Generic;

namespace TeamBuilder.ViewModels
{
	public class ProfileViewModel
	{
		public long Id { get; set; }
		public List<long> SkillsIds { get; set; }
		public bool IsSearchable { get; set; }
	}
}