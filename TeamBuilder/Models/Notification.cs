﻿using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace TeamBuilder.Models
{
	public class Notification
	{
		public Notification(long userId, DateTime dateTimeNotify, string message, NotifyType notifyType, IEnumerable<NotificationItem> items)
		: this(userId, dateTimeNotify, message, notifyType, JsonConvert.SerializeObject(items))
		{ }

		public Notification(long userId, DateTime dateTimeNotify, string message, NotifyType notifyType, string items)
		{
			UserId = userId;
			DateTimeNotify = dateTimeNotify;
			Message = message;
			NotifyType = notifyType;
			Items = items;
			IsNew = true;

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

	public class NotificationItem
	{
		public NotificationItem(string placement, string id, string text)
		{
			Placement = placement;
			Id = id;
			Text = text;
		}

		public string Placement { get; set; }
		public string Id { get; set; }
		public string Text { get; set; }
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