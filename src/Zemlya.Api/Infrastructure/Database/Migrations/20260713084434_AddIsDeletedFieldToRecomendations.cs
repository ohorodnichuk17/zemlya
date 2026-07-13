using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zemlya.Api.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddIsDeletedFieldToRecomendations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Recommendations",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Recommendations");
        }
    }
}
