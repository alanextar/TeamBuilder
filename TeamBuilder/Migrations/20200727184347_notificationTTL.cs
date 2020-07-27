using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TeamBuilder.Migrations
{
    public partial class notificationTTL : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Ttl",
                table: "Notifications",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ttl",
                table: "Notifications");
        }
    }
}
