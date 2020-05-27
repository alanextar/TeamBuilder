using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using TeamBuilder.Extensions;

namespace TeamBuilder.Models.Other
{
	public class LaunchParams
	{
		public long VkUserId { get; set; }
		public long VkAppId { get; set; }
		public int VkIsAppUser { get; set; }
		public int VkAreNotificationsEnabled { get; set; }
		public string VkLanguage { get; set; }
		public string VkRef { get; set; }
		public string VkAccessTokenSettings { get; set; }
		public long VkGroupId { get; set; }
		public string VkViewerGroupRole { get; set; }
		public string VkPlatform { get; set; }
		public int VkIsFavorite { get; set; }
		public string Sign { get; set; }
		public string Hash { get; set; }

		public Dictionary<string, string> ParsedQuery { get; set; }

		public static LaunchParams Parse([NotNull]string queryRaw)
		{
			if (string.IsNullOrEmpty(queryRaw))
				throw new ArgumentNullException(nameof(queryRaw));

			var full = queryRaw.Trim('?', '/').Split('#');
			var query = full[0];
			var hash = full.Length == 2 ? full[1] : null;

			var parameters = query
				.Split('&', StringSplitOptions.RemoveEmptyEntries)
				.Select(p => p.Split('='))
				.ToDictionary(kpv => kpv[0], kvp => kvp.Length == 2 ? kvp[1] : string.Empty);

			var result = new LaunchParams
			{
				VkUserId = parameters.TryGetValue("vk_user_id", out var vkUserId) ? long.Parse(vkUserId) : long.MinValue,
				VkAppId = parameters.TryGetValue("vk_app_id", out var vkAppId) ? long.Parse(vkAppId) : long.MinValue,
				VkIsAppUser = parameters.TryGetValue("vk_is_app_user", out var vkIsAppUser) ? int.Parse(vkIsAppUser) : int.MinValue,
				VkAreNotificationsEnabled = parameters.TryGetValue("vk_are_notifications_enabled", out var vkAreNotificationsEnabled) ? int.Parse(vkAreNotificationsEnabled) : int.MinValue,
				VkLanguage = parameters.GetValueOrDefault("vk_language"),
				VkRef = parameters.GetValueOrDefault("vk_ref"),
				VkAccessTokenSettings = parameters.GetValueOrDefault("vk_access_token_settings"),
				VkGroupId = parameters.TryGetValue("vk_group_id", out var vkGroupId) ? long.Parse(vkGroupId) : long.MinValue,
				VkViewerGroupRole = parameters.GetValueOrDefault("vk_viewer_group_role"),
				VkPlatform = parameters.GetValueOrDefault("vk_platform"),
				VkIsFavorite = parameters.TryGetValue("vk_is_favorite", out var vkIsFavorite) ? int.Parse(vkIsFavorite) : int.MinValue,
				Sign = parameters.GetValueOrDefault("sign"),
				Hash = hash,
				ParsedQuery = parameters
			};

			return result;
		}
	}
}