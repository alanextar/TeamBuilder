using Microsoft.EntityFrameworkCore.Migrations;

namespace TeamBuilder.Migrations
{
    public partial class AddedIsOwner : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsOwner",
                table: "UserTeams",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionRequiredMembers",
                table: "Teams",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Link",
                table: "Teams",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NumberRequiredMembers",
                table: "Teams",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "OwnerId",
                table: "Events",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Events_OwnerId",
                table: "Events",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Users_OwnerId",
                table: "Events",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Users_OwnerId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_OwnerId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "IsOwner",
                table: "UserTeams");

            migrationBuilder.DropColumn(
                name: "DescriptionRequiredMembers",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "Link",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "NumberRequiredMembers",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Events");
        }
    }
}
