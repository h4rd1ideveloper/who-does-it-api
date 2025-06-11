import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCategoryVisit1749587136168 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'category_visits',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          {
            name: 'category_id',
            type: 'int',
          },
          {
            name: 'visited_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'category_visits',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('category_visits');
    if (table) {
      const fk = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('category_id') !== -1,
      );
      if (fk) {
        await queryRunner.dropForeignKey('category_visits', fk);
      }
    }

    await queryRunner.dropTable('category_visits');
  }
}
