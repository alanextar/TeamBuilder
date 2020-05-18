using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TeamBuilder.DTO
{
	public class ProfileDto
	{
		public long VkId { get; set; }
		public List<long> SkillsIds { get; set; }
	}
}
