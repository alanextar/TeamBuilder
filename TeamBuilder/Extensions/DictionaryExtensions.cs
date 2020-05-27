using System.Collections.Generic;

namespace TeamBuilder.Extensions
{
	public static class DictionaryExtensions
	{
		public static bool TryGetValue<TKey, TValue>(this Dictionary<TKey, TValue> dictionary, TKey key, out TValue value)
		{
			value = default;

			if (!dictionary.ContainsKey(key)) 
				return false;

			value = dictionary[key];
			return true;
		}

		public static TValue GetValueOrDefault<TKey, TValue>(this Dictionary<TKey, TValue> dictionary, TKey key)
		{
			return dictionary.TryGetValue(key, out var value) ?  value : default;
		}
	}
}