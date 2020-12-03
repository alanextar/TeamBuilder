using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TeamBuilder.Models.Other;
using TeamBuilder.Services;

namespace TeamBuilder
{
	public class VkAuthenticationOptions : AuthenticationSchemeOptions
	{ }

	public class VkAuthenticationHandler : AuthenticationHandler<VkAuthenticationOptions>
	{
		private readonly IVkSignChecker vkSignChecker;

		public VkAuthenticationHandler(
			IOptionsMonitor<VkAuthenticationOptions> options,
			ILoggerFactory logger,
			UrlEncoder encoder,
			ISystemClock clock,
			IVkSignChecker vkSignChecker) : base(options, logger, encoder, clock)
		{
			this.vkSignChecker = vkSignChecker;
		}

		protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
		{
			var header = Request.Headers["Launch-Params"].ToString();
			var query = Request.Query.ContainsKey("access_token") ? Request.Query["access_token"].ToString() : null;

			if (string.IsNullOrEmpty(header) && string.IsNullOrEmpty(query))
				return await Task.FromResult(AuthenticateResult.NoResult());

			var launchParams = string.IsNullOrEmpty(header) ? query : header;
			var parsedLaunchParams = LaunchParams.Parse(launchParams);

			if (!vkSignChecker.Verify(parsedLaunchParams.ParsedQuery))
				return await Task.FromResult(AuthenticateResult.Fail("User launch params invalid"));

			var claims = new List<Claim>
			{
				new Claim(ClaimTypes.Name, parsedLaunchParams.VkUserId.ToString()),
				new Claim(ClaimTypes.Role, "VkUser")
			};

			var identity = new ClaimsIdentity(claims, Scheme.Name);
			var principal = new System.Security.Principal.GenericPrincipal(identity, null);
			var ticket = new AuthenticationTicket(principal, Scheme.Name);
			return await Task.FromResult(AuthenticateResult.Success(ticket));
		}
	}
}