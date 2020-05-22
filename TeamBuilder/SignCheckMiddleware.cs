using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using TeamBuilder.Extensions;

namespace TeamBuilder
{
	public static class MiddlewareExtensions
	{
		public static IApplicationBuilder UserSignCheck(this IApplicationBuilder builder)
		{
			return builder.UseMiddleware<SignCheckMiddleware>();
		}
	}

	public class SignCheckMiddleware
	{
		private readonly RequestDelegate next;
		private readonly IWebHostEnvironment env;
		private readonly IConfiguration configuration;

		public SignCheckMiddleware(RequestDelegate next, IWebHostEnvironment env, IConfiguration configuration)
		{
			this.next = next;
			this.env = env;
			this.configuration = configuration;
		}

		public async Task InvokeAsync(HttpContext context)
		{
			var launchParams = context.Request.Headers["Launch-Params"].ToString();
			var parsed = string.IsNullOrEmpty(launchParams) ? null : context.Request.VkLaunchParams().ParsedQuery;

			if (!Check(parsed))
			{
				context.Response.StatusCode = 403;
				await context.Response.WriteAsync("Launch params is invalid");
			}
			else
			{
				await next.Invoke(context);
			}
		}

		private bool Check(IReadOnlyDictionary<string, string> launchParams)
		{
			if (env.IsDevelopment() && launchParams == null)
				return true;

			if (!launchParams.ContainsKey("sign") || string.IsNullOrEmpty(launchParams["sign"]))
				return false;

			var secret = env.IsDevelopment() ? configuration["VK_SECURE_KEY"] : Environment.GetEnvironmentVariable("VK_SECURE_KEY");
			if (string.IsNullOrEmpty(secret))
				return false;

			var checkedQuery = launchParams
				.Where(q => q.Key.StartsWith("vk_"))
				.OrderBy(q => q.Key)
				.Select(q => $"{q.Key}={q.Value}")
				.Join("&");

			var sign = GetSign(checkedQuery, secret);

			return sign == launchParams["sign"];
		}

		private string GetSign(string checkedQuery, string secret)
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
