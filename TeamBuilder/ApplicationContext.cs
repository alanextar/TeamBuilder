using Microsoft.EntityFrameworkCore;
using TeamBuilder.Models;

namespace TeamBuilder
{
	public class ApplicationContext: DbContext
	{
        public DbSet<User> Users { get; set; }
        public DbSet<UserTeam> UserTeams { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<UserSkill> UserSkills { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Event> Events { get; set; }
		public DbSet<Image> Images { get; set; }

		public DbSet<Connection> Connections { get; set; }
		public DbSet<Notification> Notifications { get; set; }

		public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
            //Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserTeam>()
                .HasKey(t => new { t.UserId, t.TeamId });

            modelBuilder.Entity<UserSkill>()
                .HasKey(t => new { t.UserId, t.SkillId });

        }
    }
}
