﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using TeamBuilder.Controllers;
using TeamBuilder.Controllers.Paging;

namespace TeamBuilder.Models
{
	public class Event: IDbItem
	{
		public long Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string StartDate { get; set; }
		public string FinishDate { get; set; }
		public string Link { get; set; }
		public List<Team> Teams { get; set; }
		[ForeignKey(nameof(OwnerId))]
		public User Owner { get; set; }
		public long? OwnerId { get; set; }
	}
}
