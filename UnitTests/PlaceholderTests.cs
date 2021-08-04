using System.Collections.Generic;
using FluentAssertions;
using NUnit.Framework;
using TeamBuilder.Models;
using TeamBuilder.Services;

namespace UnitTests
{
	public class PlaceholderTests
	{
		[SetUp]
		public void Setup()
		{
		}

		[Test]
		public void InsertOnePlaceholder()
		{
			var message = "Вас пригласили в команду {0}";
			var items = new List<NoticeItem>
			{
				NoticeItem.Team(27, "Super puper Team")
			};

			message = PlaceholderBuilder.Build(message, items);

			message.Should().Be("Вас пригласили в команду #[Team27]");
		}

		[Test]
		public void InsertTwoPlaceholder()
		{
			var message = "Вас пригласили в команду {0} по рекомендации пользователя {1}";
			var items = new List<NoticeItem>
			{
				NoticeItem.Team(27, "Super puper Team"),
				NoticeItem.User(666, "Milkov")
			};

			message = PlaceholderBuilder.Build(message, items);

			message.Should().Be("Вас пригласили в команду #[Team27] по рекомендации пользователя #[User666]");
		}
	}
}