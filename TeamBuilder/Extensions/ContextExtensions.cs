using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TeamBuilder.Extensions
{
	public static class ContextExtensions
	{
        public static void TryUpdateManyToMany<T, TKey>(this ApplicationContext db, IEnumerable<T> currentItems, IEnumerable<T> newItems, Func<T, TKey> getKey) where T : class
        {
            var itemsToRemove = currentItems.Except(newItems, getKey);
            var itemsToAdd = newItems.Except(currentItems, getKey);
            db.Set<T>().RemoveRange(itemsToRemove);
            db.Set<T>().AddRange(itemsToAdd);
        }

        public static IEnumerable<T> Except<T, TKey>(this IEnumerable<T> items, IEnumerable<T> other, Func<T, TKey> getKeyFunc)
        {
            return items
                .GroupJoin(other, getKeyFunc, getKeyFunc, (item, tempItems) => new { item, tempItems })
                .SelectMany(t => t.tempItems.DefaultIfEmpty(), (t, temp) => new { t, temp })
                .Where(t => ReferenceEquals(null, t.temp) || t.temp.Equals(default(T)))
                .Select(t => t.t.item);
        }

    }
}
