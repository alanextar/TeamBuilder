namespace TeamBuilder.Controllers.Paging
{
	public interface IHasId
	{
		long Id { get; set; }
	}
	
	public interface IHasFullName
	{
		public string FullName { get; }
	}
}