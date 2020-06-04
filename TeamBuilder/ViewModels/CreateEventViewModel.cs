using System;

namespace TeamBuilder.ViewModels
{
	public class CreateEventViewModel
	{
		public string Name { get; set; }
		public string Description { get; set; }
		public DateTime? StartDate { get; set; }
		public DateTime? FinishDate { get; set; }
		public string Link { get; set; }
	}
}