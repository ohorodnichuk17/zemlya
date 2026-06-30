using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zemlya.Api.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddUkrainianEcoParams : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Oblast",
                table: "AgroFields",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShellingImpactLevel",
                table: "AgroFields",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "SowingDate",
                table: "AgroFields",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Oblast",
                table: "AgroFields");

            migrationBuilder.DropColumn(
                name: "ShellingImpactLevel",
                table: "AgroFields");

            migrationBuilder.DropColumn(
                name: "SowingDate",
                table: "AgroFields");
        }
    }
}
