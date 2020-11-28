using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace TeamBuilder.Models
{
	public class Notification
	{
		public Notification(long userId, string message, string imageUrl, NotifyType notifyType, IEnumerable<NoticeItem> items)
		: this(userId, DateTime.Now, message, imageUrl, notifyType, JsonConvert.SerializeObject(items))
		{ }

		public Notification(long userId, DateTime dateTimeNotify, string message, string imageUrl, NotifyType notifyType, string items)
		{
			UserId = userId;
			DateTimeNotify = dateTimeNotify;
			Message = message;
			ImageUrl = imageUrl;
			NotifyType = notifyType;
			Items = items;
			IsNew = true;

			Ttl = DateTime.Today.AddDays(21);
		}

		public long Id { get; set; }

		public long UserId { get; set; }

		public DateTime DateTimeNotify { get; set; }
		public string Message { get; set; }
		public string ImageUrl { get; set; }
		public NotifyType NotifyType { get; set; }
		public string Items { get; set; }

		public bool IsNew { get; set; }
		public DateTime Ttl { get; set; }
	}

	public enum NotifyType
	{
		Info,
		Add,
		Destructive,
		Service
	}

	public class NoticeItem
	{
		public NoticeItem(NoticePlaceholder placement, string id, string text)
		{
			Placement = placement.ToString("G");
			Id = id;
			Text = text;
		}

		public static NoticeItem Team(long id, string name) => new NoticeItem(NoticePlaceholder.Team, id.ToString(), name);
		public static NoticeItem User(long id, string name) => new NoticeItem(NoticePlaceholder.User, id.ToString(), name);
		public static NoticeItem Event(long id, string name) => new NoticeItem(NoticePlaceholder.Event, id.ToString(), name);

		public string Placement { get; set; }
		public string Id { get; set; }
		public string Text { get; set; }
	}

	public enum NoticePlaceholder
	{
		Team,
		User,
		Event
	}
}