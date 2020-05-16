using Microsoft.EntityFrameworkCore.Migrations;

namespace TeamBuilder.Migrations
{
    public partial class AddedVkId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "VkId",
                table: "Users",
                nullable: false,
                defaultValue: 0L);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VkId",
                table: "Users");
        }
    }
}
