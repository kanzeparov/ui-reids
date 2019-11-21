import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm';

export class AddTzToUser1565166664978 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn('users', new TableColumn({
      name: 'tz',
      type: 'varchar(255)',
      default: "'UTC'"
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('users', 'tz');
  }
}
