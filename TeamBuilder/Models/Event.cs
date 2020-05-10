using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TeamBuilder.Models
{
	public class Event
	{
		public long Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public List<TeamEvent> TeamEvents { get; set; }
	}
}
