using System;
using System.Collections.Generic;
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
			string message,
			List<NotificationItem> items)
		{
			var notification = new Notification(userId, DateTime.Now, message, NotifyType.Regular, items);

			await context.Notifications.AddAsync(notification);
			await context.SaveChangesAsync();

			var user = await context.Connections.FirstOrDefaultAsync(u => u.UserId == userId);
			if (user?.ConnectStatus == ConnectStatus.Online)
				await hubContext.Clients
					.User(userId.ToString())
					.SendAsync("notify", new object[] { notification });

		}
	}
}