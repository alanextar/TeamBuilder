using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TeamBuilder.Hubs;
using TeamBuilder.Models;

namespace TeamBuilder.Services
{
	public class NotificationSender
	{
		private readonly ApplicationContext context;
		private readonly IHubContext<NotificationHub> hubContext;
		private readonly ILogger<NotificationSender> logger;

		public NotificationSender(
			ApplicationContext context,
			IHubContext<NotificationHub> hubContext,
			ILogger<NotificationSender> logger)
		{
			this.context = context;
			this.hubContext = hubContext;
			this.logger = logger;
		}

		public async Task Send(
			long userId,
			NotifyType notifyType,
			string message,
			IEnumerable<NoticeItem> items)
		{
			await Send(userId, notifyType, message, items.ToArray());
		}

		public async Task Send(
			long userId,
			NotifyType notifyType,
			string message,
			params NoticeItem[] items)
		{
			message = PlaceholderBuilder.Build(message, items);
			var notification = new Notification(userId, message, notifyType, items);

			await context.Notifications.AddAsync(notification);
			await context.SaveChangesAsync();

			await hubContext.Clients
				.User(userId.ToString())
				.SendAsync("Notify", new object[] { notification });
		}
	}
}