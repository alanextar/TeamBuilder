using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TeamBuilder.Extensions;
using TeamBuilder.Models;
using TeamBuilder.Models.Enums;

namespace TeamBuilder.Controllers
{
	public partial class TeamsController
	{
		private async Task RejectedOrRemoveUserNotify(long userId, Team team, UserActionEnum userAction)
		{
			var requestUserId = HttpContext.User.Identity.Name;

			var teamItem = NoticeItem.Team(team);
			var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);
			if (requestUserId != userId.ToString())
			{
				switch (userAction)
				{
					case UserActionEnum.RejectedTeamRequest:
						await notificationSender.Send(userId, NotifyType.Destructive,
							"Команда {0} отклонила вашу заявку", team.Image.DataURL, teamItem);
						break;
					case UserActionEnum.QuitTeam:
						await notificationSender.Send(userId, NotifyType.Destructive,
							"Команда {0} исключила вас из списка участников", team.Image.DataURL, teamItem);
						break;
				}
			}
			else
			{
				var items = new List<NoticeItem> {NoticeItem.User(user), teamItem};
				var ownerId = await context.Teams.GetOwnerId(team.Id);
				switch (userAction)
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
		}

		private async Task JoinTeamNotify(long userId, Team team, User user, UserActionEnum wasAction)
		{
			var teamItem = NoticeItem.Team(team);
			var ownerId = await context.Teams.GetOwnerId(team.Id);
			switch (wasAction)
			{
				case UserActionEnum.ConsideringOffer:
					await notificationSender.Send(ownerId, NotifyType.Destructive,
						"{0} принял приглашение вступить в команду {1}", user.Photo100,
						NoticeItem.User(user), teamItem);
					break;
				case UserActionEnum.SentRequest:
					await notificationSender.Send(userId, NotifyType.Destructive,
						"Команда {0} добавила вас в список участников", team.Image.DataURL,
						teamItem);
					break;
			}
		}
	}
}