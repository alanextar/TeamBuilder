using System;
using System.Collections.Generic;
using System.Linq;
using Flurl;
using Microsoft.AspNetCore.Http;
using TeamBuilder.Controllers.Paging;
using TeamBuilder.Models.Other;
using TeamBuilder.ViewModels;

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

		public static Page<T> GetPage<T>(
			this IEnumerable<T> set,
			int pageSize,
			string request,
			int page = 0,
			bool prev = false,
			Func<T, bool> filter = null) where T : IHasId
		{
			if (pageSize == 0)
				return new Page<T>(new List<T>(), null);

			filter ??= _ => true;

			var countTake = prev ? (page + 1) * pageSize : pageSize;
			var countSkip = prev ? 0 : page * pageSize;

			string nextHref = null;
			var items = set.OrderBy(s => s.Id).Skip(countSkip).Take(++countTake).ToList();
			if (items.Count == countTake)
			{
				nextHref = request.SetQueryParams(new { pageSize = pageSize, page = ++page });
				items = items.SkipLast(1).ToList();
			}

			return new Page<T>(items, nextHref);
		}

		public static LaunchParams VkLaunchParams(this HttpContext context)
		{
			return context.Request.VkLaunchParams();
		}

		public static LaunchParams VkLaunchParams(this HttpRequest request)
		{
			var raw = request.Headers["Launch-Params"].ToString();
			return LaunchParams.Parse(raw);
		}
	}
}
