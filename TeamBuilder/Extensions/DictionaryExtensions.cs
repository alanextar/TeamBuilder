using System.Collections.Generic;

namespace TeamBuilder.Extensions
{
	public static class DictionaryExtensions
	{
		public static TValue GetValueOrDefault<TKey, TValue>(this Dictionary<TKey, TValue> dictionary, TKey key)
		{
			return dictionary.TryGetValue(key, out var value) ?  value : default;
		}
	}
}