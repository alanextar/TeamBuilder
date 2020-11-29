using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamBuilder.Models;
using TeamBuilder.Models.Enums;

namespace TeamBuilder.Helpers
{
	public static class ErrorMessage
	{
	}

	public static class UserErrorMessages
	{
		public static string NotFound { get; set; } = "Пользователь не найден";
		public static string AppendToTeam { get; set; } = "Ошибка при добавлении пользователя в команду";
		public static string IsNotSearchable { get; set; } = "Пользователь не ищет команду";
		internal static string NotFoundUserTeam(long userId, long teamId)
		{
			var debugMsg = $"Not found User {userId} or user {userId} inside Team {teamId}";
			return debugMsg;
		}
	}

	public static class CommonErrorMessages
	{
		public static string SaveChanges { get; set; } = "Ошибка при сохранении";
	}

	public static class TeamErrorMessages
	{
		public static string NotFound { get; set; } = "Команда не найдена";
		public static string QuitDeclineTeam { get; set; } = "Что-то пошло не так при выходе из команды";
		public static string DebugQuitDeclineTeam(long profileId, long teamId, UserTeam userTeam)
		{
			return $"User '{profileId}' have invalid userAction '{userTeam.UserAction}' for team '{teamId}'. " +
					$"Available value: {UserActionEnum.ConsideringOffer}, {UserActionEnum.JoinedTeam}";
		}

		internal static string InvalidUserAction(long userId, UserTeam userTeam, long teamId, params UserActionEnum[] allowedUserActions) 
		{
			//TODO Join enum values by comma
			var actionsStr = String.Join(", ", allowedUserActions.Select(x => x.ToString()));
			var debugMsg = $"User '{userId}' have invalid userAction '{userTeam.UserAction}' for team '{teamId}'. " +
									$"Available values: {actionsStr}";
			return debugMsg;
		}
	}
}
