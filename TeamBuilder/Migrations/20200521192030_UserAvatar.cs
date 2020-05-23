using Microsoft.EntityFrameworkCore.Migrations;

namespace TeamBuilder.Migrations
{
    public partial class UserAvatar : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Photo100",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Photo200",
                table: "Users",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Photo100",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Photo200",
                table: "Users");
        }
    }
}
