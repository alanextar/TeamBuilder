using System.ComponentModel.DataAnnotations;

namespace TeamBuilder.Models.Enums
{
	public enum UserActionEnum
	{
		[Display(Name = "Нет действия")]
		None,
		[Display(Name = "Отправил запрос в команду")]  // Из пользователя можно отменить запрос к команде, тогда UserTeam Удаляется
		SentRequest,
		[Display(Name = "В команде")] // Или юзер принял предложение, или команда приняла его заявку
		JoinedTeam,
		[Display(Name = "Отклонил запрос")] // Или юзер отклонил предложение, или команда отклонила его заявку
		RejectedTeamRequest,
		[Display(Name = "Самоустранился из команды")] // Или юзер удалился из команды, или команда удалила юзера
		QuitTeam,
		[Display(Name = "Рассматривает предложение команды")] // Из команды можно отменить запрос к пользователю, тогда UserTeam Удаляется
		ConsideringOffer
	}
}