namespace TeamBuilder.ViewModels
{
	public class CreateEventViewModel
	{
		public string Name { get; set; }
		public string Description { get; set; }
		public string StartDate { get; set; }
		public string FinishDate { get; set; }
		public string Link { get; set; }
		public long OwnerId { get; set; }
	}
}