import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class AddStamps1559751053465 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: "stamps",
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
          isNullable: false,
        },
        {
          name: "meterId",
          type: "bigint",
          isNullable: true,
        },
        {
          name: "day",
          type: "varchar(400)",
          isNullable: true,
        },
        {
          name: "dataHash",
          type: "varchar(400)",
          isNullable: true,
        },
        {
          name: "ipfsHash",
          type: "varchar(400)",
          isNullable: true,
        },
        {
          name: "ethereumTxid",
          type: "varchar(400)",
          isNullable: true,
        },
        {
          name: "notarized",
          type: "boolean",
          default: true,
          isNullable: false
        },
        {
          name: "lastCheckTimestamp",
          type: "timestamp with time zone",
          default: "now()",
        },
        {
          name: "timestamp",
          type: "timestamp with time zone",
          default: "now()",
          isNullable: false,
        },
      ],
    }));

    await queryRunner.createForeignKey("stamps", new TableForeignKey({
      name: "fk_stamps_meterId",
      columnNames: ["meterId"],
      referencedColumnNames: ["id"],
      referencedTableName: "meters",
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("stamps");
    await queryRunner.dropForeignKey("stamps", "fk_stamps_meterId");
  }
}
