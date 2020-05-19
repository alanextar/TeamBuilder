using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TeamBuilder.Models
{
	public class Role : IdentityRole
	{
		public Role()
		{

		}
		public Role(string roleName)
		{
			Name = roleName;
		}

		public static string TeamAdmin = "Создатель команды";
		public static string EventAdmin = "Создатель события";
		public static string Participant = "Участник";

		public static KeyValuePair<string, string> TeamPermission = new KeyValuePair<string, string>("permission", "team");
		public static KeyValuePair<string, string> EventPermission = new KeyValuePair<string, string>("permission", "event");
		public static KeyValuePair<string, string> ParticipantPermission = new KeyValuePair<string, string>("permission", "participant");
	}
}
