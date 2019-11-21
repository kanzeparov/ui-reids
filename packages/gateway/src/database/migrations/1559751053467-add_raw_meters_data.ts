import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class AddRawMetersData1559751053467 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.createTable(new Table({
        name: "raw_meters_data",
        columns: [
          {
            name: "id",
            type: "serial",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "data",
            type: "text",
            isNullable: true,
          },
          {
            name: "readingId",
            type: "bigint",
            isNullable: false,
          },
        ],
      }));

      await queryRunner.createForeignKey("raw_meters_data", new TableForeignKey({
        name: "fk_raw_meters_data_readingId",
        columnNames: ["readingId"],
        referencedColumnNames: ["id"],
        referencedTableName: "readings",
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropTable("raw_meters_data");
      await queryRunner.dropForeignKey("raw_meters_data", "fk_raw_meters_data_readingId");
    }
}
