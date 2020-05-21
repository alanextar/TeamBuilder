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
		None,
		[Display(Name = "Отправил запрос в команду")]
		SentRequest,
		[Display(Name = "Присоединился")]
		JoinedTeam,
		[Display(Name = "Отклонил запрос")]
		CanceledTeamRequest,
		[Display(Name = "Самоустранился из команды")]
		QuitTeam,
		[Display(Name = "Рассматривает предложение команды")]
		AcceptingOffer,
	}
}
