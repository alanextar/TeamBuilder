using System.Collections.Generic;
using System.Net;
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
	public class MyClientRateLimitMiddleware : ClientRateLimitMiddleware
	{
		private readonly ILogger<ClientRateLimitMiddleware> _logger;

		public MyClientRateLimitMiddleware(RequestDelegate next,
			IProcessingStrategy processingStrategy,
			IOptions<ClientRateLimitOptions> options,
			IRateLimitCounterStore counterStore,
			IClientPolicyStore policyStore,
			IRateLimitConfiguration config,
			ILogger<ClientRateLimitMiddleware> logger)
		: base(next, processingStrategy, options, counterStore, policyStore, config, logger)
		{
			_logger = logger;
		}

		public override Task ReturnQuotaExceededResponse(HttpContext httpContext, RateLimitRule rule, string retryAfter)
		{
			//return base.ReturnQuotaExceededResponse(httpContext, rule, retryAfter);
			var message = new { rule.Limit, rule.Period, retryAfter };

			httpContext.Response.Headers["Retry-After"] = retryAfter;

			httpContext.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
			httpContext.Response.ContentType = "application/json";
			var exception = new HttpStatusException(HttpStatusCode.TooManyRequests, CommonErrorMessages.TooManyRequests);

			return httpContext.Response.WriteAsync(JsonConvert.SerializeObject(exception));
		}
	}
}