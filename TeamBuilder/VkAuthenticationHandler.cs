using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace TeamBuilder
{
	public class VkAuthenticationOptions : AuthenticationSchemeOptions
	{
	}

	public class VkAuthenticationHandler : AuthenticationHandler<VkAuthenticationOptions>
	{
		public VkAuthenticationHandler(IOptionsMonitor<VkAuthenticationOptions> options,
			ILoggerFactory logger,
			UrlEncoder encoder,
			ISystemClock clock) : base(options,
			logger,
			encoder,
			clock)
		{
		}

		protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
		{
			var id = Request.Query.ContainsKey("access_token") ? Request.Query["access_token"].ToString() : "";
			if (string.IsNullOrEmpty(id)) 
				return AuthenticateResult.NoResult();

			var claims = new List<Claim>
			{
				new Claim(ClaimTypes.Name, id),
			};

			var identity = new ClaimsIdentity(claims, Scheme.Name);
			var principal = new System.Security.Principal.GenericPrincipal(identity, null);
			var ticket = new AuthenticationTicket(principal, Scheme.Name);
			return AuthenticateResult.Success(ticket);
		}
	}
}