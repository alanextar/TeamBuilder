using Microsoft.AspNetCore.SignalR;

namespace TeamBuilder.Hubs
{
	public class UserIdProvider : IUserIdProvider
	{
		public string GetUserId(HubConnectionContext connection)
		{
			var identityName = connection.User.Identity.Name;
			return identityName;
		}
	}
}