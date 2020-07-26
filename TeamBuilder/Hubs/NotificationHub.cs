using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace TeamBuilder.Hubs
{
	public class NotificationHub : Hub 
	{
		private readonly ILogger<NotificationHub> logger;

		public NotificationHub(ILogger<NotificationHub> logger)
		{
			this.logger = logger;
		}

		public async Task SendNotify()
		{
			logger.LogInformation($"Hub request {Context.GetHttpContext().Request.Headers[":path"]}");
			await Clients.User("252814031").SendAsync("sendNotify", new { Id = Guid.NewGuid(), Title = "Приветочка с сервера"});
		}
	}
}
