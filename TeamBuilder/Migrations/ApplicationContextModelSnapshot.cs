﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using TeamBuilder;

namespace TeamBuilder.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    partial class ApplicationContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .HasAnnotation("ProductVersion", "3.1.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("TeamBuilder.Models.Event", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("FinishDate")
                        .HasColumnType("text");

                    b.Property<string>("Link")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<long?>("OwnerId")
                        .HasColumnType("bigint");

                    b.Property<string>("StartDate")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.ToTable("Events");
                });

            modelBuilder.Entity("TeamBuilder.Models.Skill", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Skills");
                });

            modelBuilder.Entity("TeamBuilder.Models.Team", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("DescriptionRequiredMembers")
                        .HasColumnType("text");

                    b.Property<long?>("EventId")
                        .HasColumnType("bigint");

                    b.Property<string>("Link")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<int>("NumberRequiredMembers")
                        .HasColumnType("integer");

                    b.Property<string>("Photo100")
                        .HasColumnType("text");

                    b.Property<string>("Photo200")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("EventId");

                    b.ToTable("Teams");
                });

            modelBuilder.Entity("TeamBuilder.Models.User", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("About")
                        .HasColumnType("text");

                    b.Property<string>("City")
                        .HasColumnType("text");

                    b.Property<string>("FirstName")
                        .HasColumnType("text");

                    b.Property<bool>("IsModerator")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsSearchable")
                        .HasColumnType("boolean");

                    b.Property<string>("LastName")
                        .HasColumnType("text");

                    b.Property<string>("Photo100")
                        .HasColumnType("text");

                    b.Property<string>("Photo200")
                        .HasColumnType("text");

                    b.Property<string>("SecondName")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("TeamBuilder.Models.UserSkill", b =>
                {
                    b.Property<long>("UserId")
                        .HasColumnType("bigint");

                    b.Property<long>("SkillId")
                        .HasColumnType("bigint");

                    b.HasKey("UserId", "SkillId");

                    b.HasIndex("SkillId");

                    b.ToTable("UserSkills");
                });

            modelBuilder.Entity("TeamBuilder.Models.UserTeam", b =>
                {
                    b.Property<long>("UserId")
                        .HasColumnType("bigint");

                    b.Property<long>("TeamId")
                        .HasColumnType("bigint");

                    b.Property<bool?>("IsConfirmed")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsOwner")
                        .HasColumnType("boolean");

                    b.Property<int>("UserAction")
                        .HasColumnType("integer");

                    b.HasKey("UserId", "TeamId");

                    b.HasIndex("TeamId");

                    b.ToTable("UserTeams");
                });

            modelBuilder.Entity("TeamBuilder.Models.Event", b =>
                {
                    b.HasOne("TeamBuilder.Models.User", "Owner")
                        .WithMany("OwnEvents")
                        .HasForeignKey("OwnerId");
                });

            modelBuilder.Entity("TeamBuilder.Models.Team", b =>
                {
                    b.HasOne("TeamBuilder.Models.Event", "Event")
                        .WithMany("Teams")
                        .HasForeignKey("EventId");
                });

            modelBuilder.Entity("TeamBuilder.Models.UserSkill", b =>
                {
                    b.HasOne("TeamBuilder.Models.Skill", "Skill")
                        .WithMany("UserSkills")
                        .HasForeignKey("SkillId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TeamBuilder.Models.User", "User")
                        .WithMany("UserSkills")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TeamBuilder.Models.UserTeam", b =>
                {
                    b.HasOne("TeamBuilder.Models.Team", "Team")
                        .WithMany("UserTeams")
                        .HasForeignKey("TeamId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TeamBuilder.Models.User", "User")
                        .WithMany("UserTeams")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
