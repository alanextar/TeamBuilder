using System.Collections.Generic;
using TeamBuilder.Controllers.Paging;

namespace TeamBuilder.ViewModels
{
	public class UserPagingViewModel : IHasId, IHasFullName
	{
		public long Id { get; set; }
		public bool IsSearchable { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Photo200 { get; set; }
		public IEnumerable<string> Skills { get; set; }
		public bool IsTeamMember { get; set; }
		public string City { get; set; }
		public string About { get; set; }
		public string FullName { get; set; }
	}
}