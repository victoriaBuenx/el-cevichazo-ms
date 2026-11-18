using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElCevichazo.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddExpenseTicketEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Suppliers",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateTable(
                name: "ExpenseTickets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ExpenseDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    PaymentMethod = table.Column<int>(type: "integer", nullable: false),
                    PaymentStatus = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    VoucherUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    VoucherOriginalName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    TransferVoucherUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    TransferVoucherOriginalName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    SupplierId = table.Column<Guid>(type: "uuid", nullable: false),
                    RegisteredByUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    PaidAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExpenseTickets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExpenseTickets_Suppliers_SupplierId",
                        column: x => x.SupplierId,
                        principalTable: "Suppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ExpenseTickets_Users_RegisteredByUserId",
                        column: x => x.RegisteredByUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExpenseTickets_RegisteredByUserId",
                table: "ExpenseTickets",
                column: "RegisteredByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ExpenseTickets_SupplierId",
                table: "ExpenseTickets",
                column: "SupplierId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExpenseTickets");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Suppliers",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);
        }
    }
}
