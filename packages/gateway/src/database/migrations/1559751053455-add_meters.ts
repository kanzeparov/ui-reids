import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class AddMeters1559751053455 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: "meters",
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
          isNullable: false,
        },
        {
          name: "meterAccount",
          type: "varchar(400)",
          isNullable: true,
        },
        {
          name: "name",
          type: "varchar(400)",
          isNullable: true,
        },
        {
          name: "address",
          type: "varchar(200)",
          isNullable: true,
        },
        {
          name: "consumerId",
          type: "bigint",
          isNullable: false,
        },
      ],
    }));

    await queryRunner.createForeignKey("meters", new TableForeignKey({
      name: "fk_meters_consumerId",
      columnNames: ["consumerId"],
      referencedColumnNames: ["id"],
      referencedTableName: "consumers",
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("meters");
    await queryRunner.dropForeignKey("meters", "fk_meters_consumerId");
  }
}
