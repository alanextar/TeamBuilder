using System;
using AspNetCoreRateLimit;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Npgsql;
using React.AspNet;
using TeamBuilder.Hubs;
using TeamBuilder.Services;

namespace TeamBuilder
{
	public class Startup
	{
		private readonly IConfiguration configuration;
		private readonly IWebHostEnvironment webHostEnvironment;

		public string DatabaseConnectionString => webHostEnvironment.IsDevelopment()
			? configuration.GetConnectionString("DefaultConnection")
			: GetHerokuConnectionString();

		public Startup(IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
		{
			this.webHostEnvironment = webHostEnvironment;
			this.configuration = configuration;
		}

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddHttpContextAccessor();
			#region Rate Limiting
			// needed to load configuration from appsettings.json
			services.AddOptions();

			// needed to store rate limit counters and ip rules
			services.AddMemoryCache();

			// configure ip rate limiting middleware
			services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
			services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();

			// configure client rate limiting middleware
			services.Configure<ClientRateLimitOptions>(configuration.GetSection("ClientRateLimiting"));
			services.AddSingleton<IClientPolicyStore, MemoryCacheClientPolicyStore>();

			services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
			#endregion

			services.AddDbContext<ApplicationContext>(options => options.UseNpgsql(DatabaseConnectionString));

			services.AddAuthentication("Vk")
				.AddScheme<AuthenticationSchemeOptions, VkAuthenticationHandler>("Vk", null);

			services.AddSignalR();

			services.AddTransient<UserAccessChecker>();
			services.AddTransient<NotificationSender>();
			services.AddSingleton<IUserIdProvider, UserIdProvider>();
			services.AddSingleton<IVkSignChecker, VkSignChecker>();
			services.AddReact();

			services.AddControllersWithViews()
				.AddNewtonsoftJson(options =>
				{
					options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
					options.SerializerSettings.DateFormatString = "dd'.'MM'.'yyyy";
					options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
				}

			);

			// In production, the React files will be served from this directory
			services.AddSpaStaticFiles(conf =>
			{
				conf.RootPath = "ClientApp/build";
			});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			app.UseMiddleware<MyClientRateLimitMiddleware>();

			app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseSpaStaticFiles();

			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/api/error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.MapWhen(
				context => context.Request.Path.StartsWithSegments("/hub"),
				appBuilder =>
				{
					appBuilder.UseRouting();
					appBuilder.UseAuthentication();
					appBuilder.UseAuthorization();
					appBuilder.UseEndpoints(endpoints => endpoints.MapHub<NotificationHub>("/hub/notifications"));
				});

			app.MapWhen(
				context => context.Request.Path.StartsWithSegments("/api"),
				appBuilder =>
				{
					appBuilder.UseRouting();
					appBuilder.UseAuthentication();
					appBuilder.UseAuthorization();
					appBuilder.UseEndpoints(endpoints =>
					{
						endpoints.MapControllerRoute(
							name: "api",
							pattern: "/api/{controller}/{action=Index}/{id?}");
						endpoints.MapHub<NotificationHub>("/api/notifications");
					});
				});

			app.UseSpa(spa =>
			{
				spa.Options.SourcePath = "ClientApp";

				if (env.IsDevelopment())
				{
					spa.UseReactDevelopmentServer(npmScript: "start");
				}
			});
		}

		private static string GetHerokuConnectionString()
		{
			var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
			if (databaseUrl is null)
				throw new Exception("Environment variable 'DATABASE_URL' == null");

			var databaseUri = new Uri(databaseUrl);
			var userInfo = databaseUri.UserInfo.Split(':');

			var builder = new NpgsqlConnectionStringBuilder
			{
				Host = databaseUri.Host,
				Port = databaseUri.Port,
				Username = userInfo[0],
				Password = userInfo[1],
				Database = databaseUri.LocalPath.TrimStart('/'),
				SslMode = SslMode.Require,
				TrustServerCertificate = true
			};

			return builder.ToString();
		}
	}
}
