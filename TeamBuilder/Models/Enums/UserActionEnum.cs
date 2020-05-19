using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TeamBuilder.Models
{
	public enum UserActionEnum
	{
		[Display(Name = "Нет действия")]
		None = 0,
		[Display(Name = "Отправил запрос в команду")]
		SentRequest = 2,
		[Display(Name = "Присоединился")]
		JoinedTeam = 3,
		[Display(Name = "Отклонил запрос")]
		CanceledTeamRequest = 4,
		[Display(Name = "Самоустранился из команды")]
		QuitTeam = 5,
		[Display(Name = "Рассматривает предложение команды")]
		AcceptingOffer = 6,
	}
}
