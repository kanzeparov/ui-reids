import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class AddReadings1559751053460 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: "readings",
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
          isNullable: false,
        },
        {
          name: "timestamp",
          type: "TIMESTAMP WITH TIME ZONE",
          default: "now()",
          isNullable: false,
        },
        {
          name: "activePower",
          type: "numeric",
          isNullable: false,
          default: 0,
        },
        {
          name: "reactivePower",
          type: "numeric",
          isNullable: false,
          default: 0,
        },
        {
          name: "meterId",
          type: "bigint",
          isNullable: false,
        },
      ],
    }));

    await queryRunner.createForeignKey("readings", new TableForeignKey({
      name: "fk_readings_meterId",
      columnNames: ["meterId"],
      referencedColumnNames: ["id"],
      referencedTableName: "meters",
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("readings");
    await queryRunner.dropForeignKey("readings", "fk_readings_meterId");
  }
}
