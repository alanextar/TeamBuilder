using System.Collections.Generic;
using System.Threading.Tasks;
using TeamBuilder.Extensions;
using TeamBuilder.Models;
using TeamBuilder.Models.Enums;

namespace TeamBuilder.Controllers
{
	public partial class UserController
	{
		private async Task JoinTeamNotify(long teamId, User user, Team team)
		{
			var ownerId = await context.Teams.GetOwnerId(teamId);
			await notificationSender.Send(ownerId, NotifyType.Destructive,
				"{0} принял приглашение в команду {1}", user.Photo100,
				NoticeItem.User(user),
				NoticeItem.Team(team));
		}

		private async Task QuitOrDeclineTeamNotify(long teamId, User user, UserTeam userTeam)
		{
			var ownerId = await context.Teams.GetOwnerId(teamId);
			var items = new List<NoticeItem>
			{
				NoticeItem.User(user),
				NoticeItem.Team(userTeam.Team)
			};
			switch (userTeam.UserAction)
			{
				case UserActionEnum.RejectedTeamRequest:
					await notificationSender.Send(ownerId, NotifyType.Destructive,
						"{0} отказался от приглашения в команду {1}", user.Photo100, items);
					break;
				case UserActionEnum.QuitTeam:
					await notificationSender.Send(ownerId, NotifyType.Destructive,
						"{0} вышел из команды {1}", user.Photo100, items);
					break;
			}
		}

		private async Task SetTeamNotify(long userId, Team dbTeam, UserActionEnum userActionToSet)
		{
			if (userActionToSet == UserActionEnum.ConsideringOffer)
				await notificationSender.Send(userId, NotifyType.Add,
					"Вас пригласили в команду {0}",
					dbTeam.Image.DataURL,
					NoticeItem.Team(dbTeam));
		}
	}
}