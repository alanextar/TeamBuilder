using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TeamBuilder.Models;
using TeamBuilder.Models.Enums;

namespace TeamBuilder.Controllers
{
	public class PashalEggs
	{
		public static async Task Eggs(ApplicationContext context)
		{
			var users = await context.Users
				.Include(u => u.UserSkills).ThenInclude(us => us.Skill)
				.Include(u => u.UserTeams).ThenInclude(ut => ut.Team)
				.ToListAsync();
			var skills = await context.Skills.Include(s => s.UserSkills).ThenInclude(us => us.User).ToListAsync();
			var teams = await context.Teams.Include(t => t.Event).Include(t => t.UserTeams).ToListAsync();
			var events = await context.Events.ToListAsync();

			foreach (var user in users)
			{
				var skillsForUser = RandomArrayEntries(skills);
				user.UserSkills.AddRange(skillsForUser.Select(s => new UserSkill { Skill = s }));
			}

			foreach (var team in teams)
			{
				var random = new Random();
				var userToTeam = RandomArrayEntries(users, random.Next(1, 10));
				team.UserTeams.AddRange(userToTeam.Select(ut =>
					new UserTeam
					{
						IsConfirmed = random.Next(0, 1) == 0,
						User = ut,
						UserAction = (UserActionEnum)random.Next(1, 6)
					}));
				team.Event = events[random.Next(0, events.Count - 1)];
			}

			context.UpdateRange(users);
			context.UpdateRange(skills);
			context.UpdateRange(teams);
			await context.SaveChangesAsync();
		}

		public static IEnumerable<T> RandomArrayEntries<T>(List<T> arrayItems)
		{
			var random = new Random();
			return RandomArrayEntries(arrayItems, random.Next(1, arrayItems.Count));
		}

		public static IEnumerable<T> RandomArrayEntries<T>(List<T> arrayItems, int count)
		{
			var listToReturn = new List<T>();

			if (arrayItems.Count != count)
			{
				var deck = CreateShuffledDeck(arrayItems);

				for (var i = 0; i < count; i++)
				{
					var items = deck.Pop();
					listToReturn.Add(items);
				}

				return listToReturn;
			}

			return arrayItems;
		}

		public static Stack<T> CreateShuffledDeck<T>(IEnumerable<T> values)
		{
			var random = new Random();
			var list = new List<T>(values);
			var stack = new Stack<T>();
			while (list.Count > 0)
			{
				// Get the next item at random.
				var randomIndex = random.Next(0, list.Count);
				var randomItem = list[randomIndex];
				// Remove the item from the list and push it to the top of the deck.
				list.RemoveAt(randomIndex);
				stack.Push(randomItem);
			}
			return stack;
		}
	}
}