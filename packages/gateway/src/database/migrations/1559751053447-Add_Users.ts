import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AddUsers1559751053447 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "serial",
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: "login",
                    type: "varchar(400)",
                    isNullable: true,
                },
                {
                    name: "password",
                    type: "varchar(400)",
                    isNullable: true,
                },
                {
                    name: "roleId",
                    type: "bigint",
                    isNullable: true,
                },
                {
                    name: "token",
                    type: "varchar(100)",
                    isNullable: true,
                },
            ],
        }));
        await queryRunner.createForeignKey("users", new TableForeignKey({
            name: "fk_users_roleId",
            columnNames: ["roleId"],
            referencedColumnNames: ["id"],
            referencedTableName: "roles",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("users");
        await queryRunner.dropForeignKey("users", "fk_users_roleId");
    }

}
