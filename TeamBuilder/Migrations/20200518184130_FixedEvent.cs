using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TeamBuilder.Migrations
{
    public partial class FixedEvent : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FinishDate",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Link",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Teams");

            migrationBuilder.AddColumn<string>(
                name: "FinishDate",
                table: "Events",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Link",
                table: "Events",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StartDate",
                table: "Events",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FinishDate",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Link",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Events");

            migrationBuilder.AddColumn<DateTime>(
                name: "FinishDate",
                table: "Teams",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Link",
                table: "Teams",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "Teams",
                type: "timestamp without time zone",
                nullable: true);
        }
    }
}
