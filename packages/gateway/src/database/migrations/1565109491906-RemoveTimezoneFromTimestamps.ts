import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class RemoveTimezoneFromTimestamps1565109491906
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE readings ALTER COLUMN \"timestamp\" TYPE timestamp"
    );
    await queryRunner.query(
      "ALTER TABLE stamps ALTER COLUMN \"timestamp\" TYPE timestamp"
    );
    await queryRunner.query(
      "ALTER TABLE stamps ALTER COLUMN \"lastCheckTimestamp\" TYPE timestamp"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE readings ALTER COLUMN \"timestamp\" TYPE TIMESTAMP WITH TIMEZONE"
    );
    await queryRunner.query(
      "ALTER TABLE stamps ALTER COLUMN \"timestamp\" TYPE TIMESTAMP WITH TIMEZONE"
    );
    await queryRunner.query(
      "ALTER TABLE stamps ALTER COLUMN \"lastCheckTimestamp\" TYPE TIMESTAMP WITH TIMEZONE"
    );
  }
}
