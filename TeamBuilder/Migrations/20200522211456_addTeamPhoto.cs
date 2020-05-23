using Microsoft.EntityFrameworkCore.Migrations;

namespace TeamBuilder.Migrations
{
    public partial class addTeamPhoto : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Photo100",
                table: "Teams",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Photo200",
                table: "Teams",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Photo100",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Photo200",
                table: "Teams");
        }
    }
}
