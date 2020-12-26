using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using TeamBuilder.Models.Other;

namespace TeamBuilder.Services
{
	public interface IVkSignChecker
	{
		bool Verify(string query);
		bool Verify(IReadOnlyDictionary<string, string> launchParams);
	}

	public class VkSignChecker : IVkSignChecker
	{
		private readonly IWebHostEnvironment env;
		private readonly IConfiguration configuration;

		public VkSignChecker(IWebHostEnvironment env, IConfiguration configuration)
		{
			this.env = env;
			this.configuration = configuration;
		}

		public bool Verify(string query)
		{
			var parsed = !string.IsNullOrEmpty(query)
				? LaunchParams.Parse(query).ParsedQuery
				: null;

			return parsed != null && Verify(parsed);
		}

		public bool Verify(IReadOnlyDictionary<string, string> launchParams)
		{
			if (launchParams == null)
				return false;

			if (!launchParams.ContainsKey("sign") || string.IsNullOrEmpty(launchParams["sign"]))
				return false;

			var secret = env.IsDevelopment() 
				? configuration["VK_SECURE_KEY"] 
				: Environment.GetEnvironmentVariable("VK_SECURE_KEY");
			if (string.IsNullOrEmpty(secret))
				return false;

			var checkedQuery = string.Join("&", launchParams
				.Where(q => q.Key.StartsWith("vk_"))
				.OrderBy(q => q.Key)
				.Select(q => $"{q.Key}={q.Value}"));

			var sign = GetSign(checkedQuery, secret);

			return sign == launchParams["sign"];
		}

		private static string GetSign(string checkedQuery, string secret)
		{
			using var hmac = new HMACSHA256(Encoding.Default.GetBytes(secret));
			var hashValue = hmac.ComputeHash(Encoding.Default.GetBytes(checkedQuery));
			return Convert.ToBase64String(hashValue, 0, hashValue.Length)
				.Replace('+', '-')
				.Replace('/', '_')
				.TrimEnd('=');
		}
	}
}