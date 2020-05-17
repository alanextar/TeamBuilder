using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TeamBuilder.Models
{
	public class TeamEvent
	{
		public long TeamId { get; set; }
		[ForeignKey(nameof(TeamId))]
		[JsonIgnore]
		public Team Team { get; set; }
		public long EventId { get; set; }
		[ForeignKey(nameof(EventId))]
		public Event Event { get; set; }
	}
}
