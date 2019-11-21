import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTimezoneToMeter1565109080398 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "meters",
      new TableColumn({
        name: "tz",
        type: "varchar(255)",
        default: "'UTC'"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("meters", "tz")
  }
}
