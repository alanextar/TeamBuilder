using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using TeamBuilder.Controllers;
using TeamBuilder.Controllers.Paging;

namespace TeamBuilder.Models
{
	public class Event: IHasId
	{
		public long Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public DateTime? StartDate { get; set; }
		public DateTime? FinishDate { get; set; }
		public string Link { get; set; }
		public List<Team> Teams { get; set; }
		[ForeignKey(nameof(OwnerId))]
		public User Owner { get; set; }
		public long? OwnerId { get; set; }
	}
}
