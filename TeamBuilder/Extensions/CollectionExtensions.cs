using System.Collections.Generic;
using System.Linq;

namespace TeamBuilder.Extensions
{
	public static class CollectionExtensions
	{
		public static bool IsNullOrEmpty<T>(this IEnumerable<T> enumerable)
		{
			return enumerable == null || !enumerable.Any();
		}
	}
}