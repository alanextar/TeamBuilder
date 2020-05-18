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
		public string StartDate { get; set; }
		public string FinishDate { get; set; }
		public string Link { get; set; }
		public List<Team> Teams { get; set; }
	}
}
