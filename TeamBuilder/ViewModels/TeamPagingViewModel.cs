using System.Collections.Generic;
using System.Linq;
using TeamBuilder.Controllers.Paging;
using TeamBuilder.Models;
using TeamBuilder.Models.Enums;

namespace TeamBuilder.ViewModels
{
	public class TeamPagingViewModel : IHasId
	{
		public long Id { get; set; }
		public string ImageDataUrl { get; set; }
		public string Description { get; set; }
		public string Title { get; set; }
		public string EventName { get; set; }
		public int CountConfirmedUser { get; set; }
		public int NumberRequiredMembers { get; set; }
	}
}