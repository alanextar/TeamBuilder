using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TeamBuilder.Models;

namespace TeamBuilder.Hubs
{
	public class NotificationHub : Hub
	{
		private readonly ApplicationContext context;
		private readonly ILogger<NotificationHub> logger;

		public NotificationHub(ApplicationContext context, ILogger<NotificationHub> logger)
		{
			this.context = context;
			this.logger = logger;
		}

		//Test
		public async Task SendNotify()
		{
			logger.LogInformation($"Hub request {Context.GetHttpContext().Request.Path}");
			await Clients.User("252814030").SendAsync("notify", new object[]
			{
				new { Id = Guid.NewGuid(), Message = "Ещё одна", DateTime = DateTime.Now.ToString("dd.MM.yyyy HH:mm:ss") },
				new { Id = Guid.NewGuid(), Message = "Приветочка с сервера", DateTime = DateTime.Now.ToString("dd.MM.yyyy HH:mm:ss") }
			});
		}

		public async Task NoticesWasRead(long[] ids)
		{
			var notices = await context.Notifications.Where(n => ids.Contains(n.Id)).ToListAsync();
			notices.ForEach(n => n.IsNew = false);
			await context.SaveChangesAsync();
		}

		public override async Task OnConnectedAsync()
		{
			if (!long.TryParse(Context.UserIdentifier, out var userId))
				return;

			await SendNotify(userId);
		}

		private async Task SendNotify(long userId)
		{
			var notifications = await context.Notifications.Where(n => n.UserId == userId).ToListAsync();
			if (notifications.Any())
			{
				await Clients.User(Context.UserIdentifier).SendAsync("notify", notifications);
			}
		}
	}
}
