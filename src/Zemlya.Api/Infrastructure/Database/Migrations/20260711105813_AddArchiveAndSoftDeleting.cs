using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zemlya.Api.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddArchiveAndSoftDeleting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "AgroFields",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "AgroFields",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "AgroFields");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "AgroFields");
        }
    }
}
