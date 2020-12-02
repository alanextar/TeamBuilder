using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TeamBuilder.Models;
using TeamBuilder.Models.Enums;

namespace TeamBuilder.Controllers
{
	public class EasterEggs
	{
		public static async Task Eggs(ApplicationContext context)
		{
			var httpClient = new HttpClient();
			await Initialize(context);

			var users = await context.Users
				.Include(u => u.UserSkills).ThenInclude(us => us.Skill)
				.Include(u => u.UserTeams).ThenInclude(ut => ut.Team)
				.ToListAsync();
			var skills = await context.Skills.Include(s => s.UserSkills).ThenInclude(us => us.User).ToListAsync();
			var teams = await context.Teams.Include(t => t.Image).Include(t => t.Event).Include(t => t.UserTeams).ToListAsync();
			var events = await context.Events.ToListAsync();

			var random = new Random();

			foreach (var user in users)
			{
				var skillsForUser = RandomArrayEntries(skills);
				user.UserSkills.AddRange(skillsForUser.Select(s => new UserSkill { Skill = s }));
			}

			foreach (var team in teams)
			{
				var userToTeam = RandomArrayEntries(users, random.Next(1, 10));
				team.UserTeams.AddRange(userToTeam.Select(ut =>
					new UserTeam
					{
						User = ut,
						UserAction = (UserActionEnum)random.Next(1, 6)
					}));
				team.Event = events[random.Next(0, events.Count)];
				team.Image = await GetRandomImage(httpClient);
				var id = random.Next(0, team.UserTeams.Count);
				team.UserTeams[id].IsOwner = true;
				team.UserTeams[id].UserAction = UserActionEnum.JoinedTeam;
			}

			foreach (var @event in events)
			{
				@event.OwnerId = users[random.Next(0, users.Count)].Id;
			}

			context.UpdateRange(users);
			context.UpdateRange(skills);
			context.UpdateRange(teams);
			context.UpdateRange(events);
			await context.SaveChangesAsync();

			httpClient.Dispose();
		}

		private static async Task<Image> GetRandomImage(HttpClient httpClient)
		{
			var newGuid = Guid.NewGuid().ToString();
			var url = @$"https://picsum.photos/seed/{newGuid}/100";
			var data = await httpClient.GetByteArrayAsync(url);

			return new Image{Data = data, Title = newGuid};
		}


		private static async Task Initialize(ApplicationContext context)
		{
			var fileUser = await System.IO.File.ReadAllTextAsync(@"DemoDataSets\users.json");
			var fileSkills = await System.IO.File.ReadAllTextAsync(@"DemoDataSets\skills.json");
			var fileEvents = await System.IO.File.ReadAllTextAsync(@"DemoDataSets\events.json");
			var fileTeams = await System.IO.File.ReadAllTextAsync(@"DemoDataSets\teams.json");

			var events = JsonConvert.DeserializeObject<Event[]>(fileEvents);
			var users = JsonConvert.DeserializeObject<User[]>(fileUser);
			var skills = JsonConvert.DeserializeObject<Skill[]>(fileSkills);
			var teams = JsonConvert.DeserializeObject<Team[]>(fileTeams);
			teams = teams.Select(t =>
			{
				t.NumberRequiredMembers = new Random().Next(0, 15);
				return t;
			}).ToArray();


			await context.Users.AddRangeAsync(users);
			await context.Skills.AddRangeAsync(skills);
			await context.Events.AddRangeAsync(events);
			await context.Teams.AddRangeAsync(teams);
			await context.SaveChangesAsync();
		}

		#region RandomArray

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

		#endregion
	}
}