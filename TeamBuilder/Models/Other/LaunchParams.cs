using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using TeamBuilder.Extensions;

namespace TeamBuilder.Models.Other
{
	public class LaunchParams
	{
		public string VkUserId { get; set; }
		public string VkAppId { get; set; }
		public string VkIsAppUser { get; set; }
		public string VkAreNotificationsEnabled { get; set; }
		public string VkLanguage { get; set; }
		public string VkRef { get; set; }
		public string VkAccessTokenSettings { get; set; }
		public string VkGroupId { get; set; }
		public string VkViewerGroupRole { get; set; }
		public string VkPlatform { get; set; }
		public string VkIsFavorite { get; set; }
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
				VkUserId = parameters.GetValueOrDefault("vk_user_id"),
				VkAppId = parameters.GetValueOrDefault("vk_app_id"),
				VkIsAppUser = parameters.GetValueOrDefault("vk_is_app_user"),
				VkAreNotificationsEnabled = parameters.GetValueOrDefault("vk_are_notifications_enabled"),
				VkLanguage = parameters.GetValueOrDefault("vk_language"),
				VkRef = parameters.GetValueOrDefault("vk_ref"),
				VkAccessTokenSettings = parameters.GetValueOrDefault("vk_access_token_settings"),
				VkGroupId = parameters.GetValueOrDefault("vk_group_id"),
				VkViewerGroupRole = parameters.GetValueOrDefault("vk_viewer_group_role"),
				VkPlatform = parameters.GetValueOrDefault("vk_platform"),
				VkIsFavorite = parameters.GetValueOrDefault("vk_is_favorite"),
				Sign = parameters.GetValueOrDefault("sign"),
				Hash = hash,
				ParsedQuery = parameters
			};

			return result;
		}
	}
}