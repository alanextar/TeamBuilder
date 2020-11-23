using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace TeamBuilder.Models
{
	public class Notification
	{
		public Notification(long userId, DateTime dateTimeNotify, string message, NotifyType notifyType, Dictionary<string, string> items)
		: this(userId, dateTimeNotify, message, notifyType, JsonConvert.SerializeObject(items))
		{ }

		public Notification(long userId, DateTime dateTimeNotify, string message, NotifyType notifyType, string items)
		{
			UserId = userId;
			DateTimeNotify = dateTimeNotify;
			Message = message;
			NotifyType = notifyType;
			Items = items;

			Ttl = DateTime.Now.AddDays(7);
		}

		public long Id { get; set; }

		public long UserId { get; set; }

		public DateTime DateTimeNotify { get; set; }
		public string Message { get; set; }
		public NotifyType NotifyType { get; set; }
		public string Items { get; set; }

		public bool IsNew { get; set; }
		public DateTime Ttl { get; set; }
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