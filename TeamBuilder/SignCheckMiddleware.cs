using System;
using System.Web;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Hosting;

namespace TeamBuilder
{
	public static class MiddlewareExtensions
	{
		public static IApplicationBuilder UserSignCheck(this IApplicationBuilder builder, IWebHostEnvironment env)
		{
			return builder.UseMiddleware<SignCheckMiddleware>(env);
		}
	}

	public class SignCheckMiddleware
	{
		private readonly RequestDelegate next;
		private readonly IWebHostEnvironment env;

		public SignCheckMiddleware(RequestDelegate next, IWebHostEnvironment env)
		{
			this.next = next;
			this.env = env;
		}

		public async Task InvokeAsync(HttpContext context)
		{
			var launchParams = context.Request.Headers["Launch-Params"].ToString();

			if (!Check(launchParams))
			{
				context.Response.StatusCode = 403;
				await context.Response.WriteAsync("Launch params is invalid");
			}
			else
			{
				await next.Invoke(context);
			}
		}

		private bool Check(string launchParams)
		{
			if (env.IsDevelopment() && string.IsNullOrEmpty(launchParams)) //TODO убрать 2ое условие после того как проверю что всё работает
				return true;

			var queryNvc = HttpUtility.ParseQueryString(new Uri($"http://localhost/{launchParams}").Query);
			var query = queryNvc.AllKeys.ToDictionary(k => k, k => queryNvc[k]);
			var secret = "LcONGCzY9tjwmWqvYQxB";
			var checkedQuery = query
				.Where(q => q.Key.StartsWith("vk_"))
				.OrderBy(q => q.Key)
				.Select(q => $"{q.Key}={q.Value}")
				.Join("&");

			var sign = GetSign(checkedQuery, secret);

			return sign == query["sign"];
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
