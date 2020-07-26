using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using Npgsql;
using React.AspNet;
using TeamBuilder.Hubs;
using TeamBuilder.Services;

namespace TeamBuilder
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddDbContext<ApplicationContext>(options => options.UseNpgsql(GetConnectionString()));

			services.AddAuthentication("Vk")
				.AddScheme<VkAuthenticationOptions, VkAuthenticationHandler>("Vk", null);

			services.AddSignalR();

			services.AddHttpContextAccessor();
			services.AddTransient<UserAccessChecker>();
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
			services.AddSpaStaticFiles(configuration =>
			{
				configuration.RootPath = "ClientApp/build";
			});


			services.AddSingleton<IUserIdProvider, UserIdProvider>();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseSpaStaticFiles();
			app.UseAuthentication();

			app.MapWhen(
				context => context.Request.Path.StartsWithSegments("/hub"),
				appBuilder =>
				{
					appBuilder.UseRouting();
					appBuilder.UseEndpoints(endpoints => endpoints.MapHub<NotificationHub>("/hub/notifications"));
				});

			app.MapWhen(
				context => context.Request.Path.StartsWithSegments("/api"),
				appBuilder =>
				{
					appBuilder.UseRouting();
					appBuilder.UserSignCheck();

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

		private string GetConnectionString()
		{
			var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
			if (databaseUrl is null)
				return Configuration.GetConnectionString("DefaultConnection");

			var databaseUri = new Uri(databaseUrl);
			var userInfo = databaseUri.UserInfo.Split(':');

			var builder = new NpgsqlConnectionStringBuilder
			{
				Host = databaseUri.Host,
				Port = databaseUri.Port,
				Username = userInfo[0],
				Password = userInfo[1],
				Database = databaseUri.LocalPath.TrimStart('/')
			};
			return builder.ToString();
		}
	}
}
