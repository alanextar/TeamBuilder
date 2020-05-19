using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TeamBuilder.Models
{
	[Table("Users")]
	public class AbilityUser
	{
		public virtual ICollection<Role> Roles { get; } = new List<Role>();
		public virtual ICollection<Claim> Claims { get; } = new List<Claim>();
	}
}
