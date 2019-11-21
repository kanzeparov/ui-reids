import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class AddConsumers1559751053449 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.createTable(new Table({
        name: "consumers",
        columns: [
          {
            name: "id",
            type: "serial",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "name",
            type: "varchar(400)",
            isNullable: true,
          },
          {
            name: "address",
            type: "varchar(500)",
            isNullable: true,
          },
          {
            name: "inn",
            type: "varchar(200)",
            isNullable: true,
          },
          {
            name: "energyCompanyId",
            type: "bigint",
            isNullable: true,
          },
        ],
      }));
      await queryRunner.createForeignKey("consumers", new TableForeignKey({
        name: "fk_consumers_energyCompanyId",
        columnNames: ["energyCompanyId"],
        referencedColumnNames: ["id"],
        referencedTableName: "energy_company",
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropTable("consumers");
    }
}
