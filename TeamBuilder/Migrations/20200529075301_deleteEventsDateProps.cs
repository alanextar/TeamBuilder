using Microsoft.EntityFrameworkCore.Migrations;

namespace TeamBuilder.Migrations
{
    public partial class deleteEventsDateProps : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FinishDate",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Events");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FinishDate",
                table: "Events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StartDate",
                table: "Events",
                type: "text",
                nullable: true);
        }
    }
}
