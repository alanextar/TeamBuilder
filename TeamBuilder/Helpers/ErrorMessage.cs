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
		public static string NotFoundUserTeam { get; set; } = "Не найдена команда или пользователь в ней";
		public static string AppendToTeam { get; set; } = "Ошибка при добавлении пользователя в команду";
		public static string IsNotSearchable { get; set; } = "Пользователь не ищет команду";
		public static string InvalidAction { get; set; } = "Действие не может быть выполнено";
		internal static string DebugNotFoundUserTeam(long userId, long teamId)
		{
			var debugMsg = $"Not found User {userId} or user {userId} inside Team {teamId}";
			return debugMsg;
		}
		public static string DebugNotFound(long userId)
		{
			return $"User '{userId}' not found";
		}
	}

	public static class CommonErrorMessages
	{
		public static string TooManyRequests { get; set; } = "Количество запросов в интервал времени превышает предельно допустимое значение";
		public static string SaveChanges { get; set; } = "Ошибка при сохранении";
		public static string Forbidden { get; set; } = "Ты сюда не ходи - туда ходи";
	}

	public static class TeamErrorMessages
	{
		public static string NotFound { get; set; } = "Команда не найдена";
		public static string AlreadyExists { get; set; } = "Команда с таким именем уже существует";
		public static string QuitDeclineTeam { get; set; } = "Что-то пошло не так при выходе из команды";
		public static string DebugQuitDeclineTeam(long profileId, long teamId, UserTeam userTeam)
		{
			return $"User '{profileId}' have invalid userAction '{userTeam.UserAction}' for team '{teamId}'. " +
					$"Available value: {UserActionEnum.ConsideringOffer}, {UserActionEnum.JoinedTeam}";
		}
		public static string DebugNotFound(long teamId)
		{
			return $"Team '{teamId}' not found";
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

	public static class EventErrorMessages
	{
		public static string NotFound { get; set; } = "Событие не найдено";
		public static string AlreadyExists { get; set; } = "Событие с таким именем уже существует";
		public static string QuitDeclineEvent { get; set; } = "Что-то пошло не так при выходе из события";
		public static string DebugNotFound(long id)
		{
			return $"Event '{id}' not found";
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
