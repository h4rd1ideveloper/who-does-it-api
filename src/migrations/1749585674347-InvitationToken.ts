import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InvitationToken1749585674347 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invitation_tokens',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'token', type: 'varchar', isUnique: true },
          { name: 'expires_at', type: 'date' },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invitation_tokens');
  }

}
