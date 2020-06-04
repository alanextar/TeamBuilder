using System.Collections.Generic;
using TeamBuilder.Models;

namespace TeamBuilder.ViewModels
{
	public class EditUserViewModel
	{
		public long Id { get; set; }
		public string FirstName { get; set; }
		public string SecondName { get; set; }
		public string LastName { get; set; }
		public string City { get; set; }
		public string About { get; set; }
		public string Telegram { get; set; }
		public string Email { get; set; }
		public string Mobile { get; set; }
		public string Photo100 { get; set; }
		public string Photo200 { get; set; }
		public bool IsSearchable { get; set; }
		public List<long> Skills { get; set; }
	}
}