namespace TeamBuilder.Dto
{
	public class EditTeamViewModel
	{
		public long Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public int EventId { get; set; }

		public int NumberRequiredMembers { get; set; }
		public string DescriptionRequiredMembers { get; set; }
	}
}