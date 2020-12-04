using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AspNetCoreRateLimit;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace TeamBuilder
{
	public class Program
	{
		public static async Task Main(string[] args)
		{
			var webHost = CreateWebHostBuilder(args).Build();

			using (var scope = webHost.Services.CreateScope())
			{
				// get the ClientPolicyStore instance
				var clientPolicyStore = scope.ServiceProvider.GetRequiredService<IClientPolicyStore>();

				// seed Client data from appsettings
				await clientPolicyStore.SeedAsync();
			}

			await webHost.RunAsync();
		}

		public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
			WebHost.CreateDefaultBuilder(args)
				.UseStartup<Startup>();
	}
}
