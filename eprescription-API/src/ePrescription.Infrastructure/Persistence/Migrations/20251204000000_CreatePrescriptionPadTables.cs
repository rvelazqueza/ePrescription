using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EPrescription.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CreatePrescriptionPadTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Note: This migration is manually created to ensure proper Oracle compatibility
            // The tables were already created via SQL scripts in the database
            // This migration serves as a record in EF Core's migration history
            
            migrationBuilder.CreateTable(
                name: "PRESCRIPTION_PAD_TYPES",
                columns: table => new
                {
                    PAD_TYPE_ID = table.Column<byte[]>(type: "RAW(16)", nullable: false),
                    PAD_TYPE_NAME = table.Column<string>(type: "VARCHAR2(100)", nullable: false),
                    PAD_TYPE_CODE = table.Column<string>(type: "VARCHAR2(20)", nullable: false),
                    DEFAULT_QUANTITY = table.Column<decimal>(type: "NUMBER(5,0)", nullable: false, defaultValue: 50m),
                    DESCRIPTION = table.Column<string>(type: "VARCHAR2(500)", nullable: true),
                    IS_ACTIVE = table.Column<decimal>(type: "NUMBER(1,0)", nullable: false, defaultValue: 1m),
                    CREATED_AT = table.Column<DateTime>(type: "TIMESTAMP(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UPDATED_AT = table.Column<DateTime>(type: "TIMESTAMP(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PRESCRIPTION_PAD_TYPES", x => x.PAD_TYPE_ID);
                    table.UniqueConstraint("UK_PAD_TYPE_CODE", x => x.PAD_TYPE_CODE);
                });

            migrationBuilder.CreateTable(
                name: "PRESCRIPTION_PADS",
                columns: table => new
                {
                    PRESCRIPTION_PAD_ID = table.Column<byte[]>(type: "RAW(16)", nullable: false),
                    DOCTOR_ID = table.Column<byte[]>(type: "RAW(16)", nullable: false),
                    PAD_TYPE_ID = table.Column<byte[]>(type: "RAW(16)", nullable: false),
                    PAD_NUMBER = table.Column<string>(type: "VARCHAR2(50)", nullable: false),
                    AVAILABLE_COUNT = table.Column<decimal>(type: "NUMBER(5,0)", nullable: false),
                    TOTAL_COUNT = table.Column<decimal>(type: "NUMBER(5,0)", nullable: false),
                    EXPIRATION_DATE = table.Column<DateTime>(type: "DATE", nullable: false),
                    IS_ACTIVE = table.Column<decimal>(type: "NUMBER(1,0)", nullable: false, defaultValue: 1m),
                    CREATED_AT = table.Column<DateTime>(type: "TIMESTAMP(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UPDATED_AT = table.Column<DateTime>(type: "TIMESTAMP(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PRESCRIPTION_PADS", x => x.PRESCRIPTION_PAD_ID);
                    table.ForeignKey(
                        name: "FK_PAD_DOCTOR",
                        column: x => x.DOCTOR_ID,
                        principalTable: "DOCTORS",
                        principalColumn: "DOCTOR_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PAD_TYPE",
                        column: x => x.PAD_TYPE_ID,
                        principalTable: "PRESCRIPTION_PAD_TYPES",
                        principalColumn: "PAD_TYPE_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.UniqueConstraint("UK_PAD_DOCTOR_TYPE_NUMBER", x => new { x.DOCTOR_ID, x.PAD_TYPE_ID, x.PAD_NUMBER });
                });

            migrationBuilder.CreateTable(
                name: "PRESCRIPTION_SLIPS",
                columns: table => new
                {
                    SLIP_ID = table.Column<byte[]>(type: "RAW(16)", nullable: false),
                    PRESCRIPTION_PAD_ID = table.Column<byte[]>(type: "RAW(16)", nullable: false),
                    SLIP_NUMBER = table.Column<decimal>(type: "NUMBER(5,0)", nullable: false),
                    STATUS = table.Column<string>(type: "VARCHAR2(20)", nullable: false, defaultValue: "available"),
                    USED_BY_PRESCRIPTION_ID = table.Column<byte[]>(type: "RAW(16)", nullable: true),
                    USED_AT = table.Column<DateTime>(type: "TIMESTAMP(6)", nullable: true),
                    CREATED_AT = table.Column<DateTime>(type: "TIMESTAMP(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UPDATED_AT = table.Column<DateTime>(type: "TIMESTAMP(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PRESCRIPTION_SLIPS", x => x.SLIP_ID);
                    table.ForeignKey(
                        name: "FK_SLIP_PAD",
                        column: x => x.PRESCRIPTION_PAD_ID,
                        principalTable: "PRESCRIPTION_PADS",
                        principalColumn: "PRESCRIPTION_PAD_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SLIP_PRESCRIPTION",
                        column: x => x.USED_BY_PRESCRIPTION_ID,
                        principalTable: "PRESCRIPTIONS",
                        principalColumn: "PRESCRIPTION_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.UniqueConstraint("UK_SLIP_PAD_NUMBER", x => new { x.PRESCRIPTION_PAD_ID, x.SLIP_NUMBER });
                });

            migrationBuilder.CreateIndex(
                name: "IDX_PAD_DOCTOR",
                table: "PRESCRIPTION_PADS",
                column: "DOCTOR_ID");

            migrationBuilder.CreateIndex(
                name: "IDX_PAD_TYPE",
                table: "PRESCRIPTION_PADS",
                column: "PAD_TYPE_ID");

            migrationBuilder.CreateIndex(
                name: "IDX_PAD_EXPIRATION",
                table: "PRESCRIPTION_PADS",
                column: "EXPIRATION_DATE");

            migrationBuilder.CreateIndex(
                name: "IDX_SLIP_PAD",
                table: "PRESCRIPTION_SLIPS",
                column: "PRESCRIPTION_PAD_ID");

            migrationBuilder.CreateIndex(
                name: "IDX_SLIP_STATUS",
                table: "PRESCRIPTION_SLIPS",
                column: "STATUS");

            migrationBuilder.CreateIndex(
                name: "IDX_SLIP_PRESCRIPTION",
                table: "PRESCRIPTION_SLIPS",
                column: "USED_BY_PRESCRIPTION_ID");

            // Add PAD_TYPE_ID column to MEDICATIONS
            migrationBuilder.AddColumn<byte[]>(
                name: "PAD_TYPE_ID",
                table: "MEDICATIONS",
                type: "RAW(16)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IDX_MED_PAD_TYPE",
                table: "MEDICATIONS",
                column: "PAD_TYPE_ID");

            migrationBuilder.AddForeignKey(
                name: "FK_MED_PAD_TYPE",
                table: "MEDICATIONS",
                column: "PAD_TYPE_ID",
                principalTable: "PRESCRIPTION_PAD_TYPES",
                principalColumn: "PAD_TYPE_ID",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MED_PAD_TYPE",
                table: "MEDICATIONS");

            migrationBuilder.DropIndex(
                name: "IDX_MED_PAD_TYPE",
                table: "MEDICATIONS");

            migrationBuilder.DropColumn(
                name: "PAD_TYPE_ID",
                table: "MEDICATIONS");

            migrationBuilder.DropTable(
                name: "PRESCRIPTION_SLIPS");

            migrationBuilder.DropTable(
                name: "PRESCRIPTION_PADS");

            migrationBuilder.DropTable(
                name: "PRESCRIPTION_PAD_TYPES");
        }
    }
}
