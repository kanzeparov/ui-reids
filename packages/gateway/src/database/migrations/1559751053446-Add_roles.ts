import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddRoles1559751053446 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "roles",
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
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("raw_meters_data");
    }

}
