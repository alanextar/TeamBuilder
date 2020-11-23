using System;
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

		public async Task NotificationsReceived(long[] ids)
		{
			var notices = await context.Notifications.Where(n => ids.Contains(n.Id)).ToListAsync();
			context.RemoveRange(notices);
			await context.SaveChangesAsync();
		}

		public override async Task OnConnectedAsync()
		{
			var id = long.TryParse(Context.UserIdentifier, out var parsedId) ? parsedId : -1;

			await SetConnectStatusForUser(id, ConnectStatus.Online);
			await SendNotify(id);

			await context.SaveChangesAsync();
		}

		public override async Task OnDisconnectedAsync(Exception _)
		{
			var id = long.TryParse(Context.UserIdentifier, out var parsedId) ? parsedId : -1;

			await SetConnectStatusForUser(id, ConnectStatus.Offline);

			await context.SaveChangesAsync();
		}

		private async Task SendNotify(long id)
		{
			var notifications = await context.Notifications.Where(n => n.UserId == id).ToListAsync();
			if (notifications.Any())
			{
				await Clients.User(Context.UserIdentifier).SendCoreAsync("notify", new object[] { notifications });
			}
		}

		private async Task SetConnectStatusForUser(long id, ConnectStatus status)
		{
			var connection = await context.Connections.FirstOrDefaultAsync(c => c.UserId == id);
			if (connection == null)
			{
				await context.AddAsync(new Connection(id, status));
			}
			else
			{
				if (connection.ConnectStatus != status)
				{
					connection.ConnectStatus = status;
					context.Update(connection);
				}
			}
		}

	}
}
