using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IDKEY = System.Int64;

namespace TeamBuilder.Models
{
	public class Claim : IdentityUserClaim<IDKEY> { }
}
