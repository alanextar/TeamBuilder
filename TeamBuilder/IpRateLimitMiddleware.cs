using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using AspNetCoreRateLimit;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using TeamBuilder.Helpers;
using TeamBuilder.Models.Other;
using TeamBuilder.Services;
using TeamBuilder.ViewModels;

namespace TeamBuilder
{
	public class MyIpRateLimitMiddleware : IpRateLimitMiddleware
	{
		public MyIpRateLimitMiddleware(RequestDelegate next
			, IOptions<IpRateLimitOptions> options
			, IRateLimitCounterStore counterStore
			, IIpPolicyStore policyStore
			, IRateLimitConfiguration config
			, ILogger<IpRateLimitMiddleware> logger)
				: base(next, options, counterStore, policyStore, config, logger)
		{
		}

		public override Task ReturnQuotaExceededResponse(HttpContext httpContext, RateLimitRule rule, string retryAfter)
		{
			//return base.ReturnQuotaExceededResponse(httpContext, rule, retryAfter);
			var message = new { rule.Limit, rule.Period, retryAfter };

			httpContext.Response.Headers["Retry-After"] = retryAfter;

			httpContext.Response.StatusCode = 200;
			httpContext.Response.ContentType = "application/json";
			var exception = new HttpStatusException(System.Net.HttpStatusCode.TooManyRequests, CommonErrorMessages.TooManyRequests);

			return httpContext.Response.WriteAsync(JsonConvert.SerializeObject(exception));
		}
	}
}