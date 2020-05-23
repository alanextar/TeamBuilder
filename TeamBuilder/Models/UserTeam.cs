using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TeamBuilder.Models
{
	public class UserTeam
	{
		public long UserId { get; set; }
		public User User { get; set; }
		public long TeamId { get; set; }
		public Team Team { get; set; }
		public bool? IsConfirmed { get; set; }
		public bool IsOwner { get; set; }
		public UserActionEnum UserAction { get; set; }
	}
}
