import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class RefactoringUsersRelations1562186545454 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: "rel_users_ec",
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
          isNullable: false,
        },
        {
          name: "userId",
          type: "bigint",
          isNullable: false,
        },
        {
          name: "energyCompanyId",
          type: "bigint",
          isNullable: false,
        },
      ],
    }));
    await queryRunner.createForeignKey("rel_users_ec", new TableForeignKey({
      name: "fk_rel_users_ec_userId",
      columnNames: ["userId"],
      referencedColumnNames: ["id"],
      referencedTableName: "users",
    }));
    await queryRunner.createForeignKey("rel_users_ec", new TableForeignKey({
      name: "fk_rel_users_ec_energyCompanyId",
      columnNames: ["energyCompanyId"],
      referencedColumnNames: ["id"],
      referencedTableName: "energy_company",
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    //
  }

}
