using System;
using System.Collections.Generic;

namespace TeamBuilder.Models
{
	public class Notification
	{
		public long Id { get; set; }

		public long UserId { get; set; }

		public DateTime DateTimeNotify { get; set; }
		public string Message { get; set; }
		public NotifyType NotifyType { get; set; }

		public Dictionary<string, string> Items { get; set; }
	}

	public enum NotifyType
	{
		None,
		Regular,
		Destructive,
		Important,
		Service
	}
}