import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AddEnergyCompany1559751053448 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: "energy_company",
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
        }
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("energy_company");
  }

}
