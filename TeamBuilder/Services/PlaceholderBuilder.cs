using System.Collections.Generic;
using System.Linq;
using TeamBuilder.Models;

namespace TeamBuilder.Services
{
	public static class PlaceholderBuilder
	{
		public static string Build(string message, IEnumerable<NoticeItem> items)
		{
			var placeholders = items
				.Select(i => $"#[{i.Placement}{i.Id}]")
				.Cast<object>()
				.ToArray();
			return string.Format(message, placeholders);
		}
	}
}