import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class InitSchema1749481268262 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'name', type: 'varchar' },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          { name: 'password_hash', type: 'varchar' },
          {
            name: 'user_type',
            type: 'enum',
            enum: ['admin', 'prestador'],
          },
          { name: 'invite_token', type: 'varchar', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Categories
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          { name: 'slug', type: 'varchar', isUnique: true },
          { name: 'image_url', type: 'varchar', isNullable: true },
        ],
      }),
      true,
    );

    // Service Providers
    await queryRunner.createTable(
      new Table({
        name: 'service_providers',
        columns: [
          { name: 'id', type: 'int', isPrimary: true },
          {
            name: 'cpf_cnpj',
            type: 'varchar',
            isNullable: true,
          },
          { name: 'phone', type: 'varchar' },
          { name: 'address', type: 'varchar' },
          {
            name: 'city',
            type: 'varchar',
          },
          { name: 'state', type: 'varchar' },
          { name: 'zip_code', type: 'varchar' },
          {
            name: 'home_service',
            type: 'boolean',
            default: false,
          },
          { name: 'business_hours', type: 'varchar', isNullable: true },
          {
            name: 'photo_url',
            type: 'varchar',
            isNullable: true,
          },
          { name: 'is_active', type: 'boolean', default: true },
          {
            name: 'registered_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
    // FK user -> service_providers
    await queryRunner.createForeignKey(
      'service_providers',
      new TableForeignKey({
        columnNames: ['id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Services
    await queryRunner.createTable(
      new Table({
        name: 'services',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          {
            name: 'service_provider_id',
            type: 'int',
          },
          { name: 'category_id', type: 'int' },
          { name: 'title', type: 'varchar' },
          {
            name: 'description',
            type: 'text',
          },
          { name: 'price_min', type: 'double precision' },
          {
            name: 'price_max',
            type: 'double precision',
            isNullable: true,
          },
          { name: 'estimated_time', type: 'varchar' },
          {
            name: 'service_location',
            type: 'enum',
            enum: ['oficina', 'domicilio', 'ambos'],
          },
          { name: 'photo_urls', type: 'text', isNullable: true },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'services',
      new TableForeignKey({
        columnNames: ['service_provider_id'],
        referencedTableName: 'service_providers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'services',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // Reviews
    await queryRunner.createTable(
      new Table({
        name: 'reviews',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          {
            name: 'service_provider_id',
            type: 'int',
          },
          { name: 'client_name', type: 'varchar' },
          { name: 'rating', type: 'int' },
          {
            name: 'comment',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'reviews',
      new TableForeignKey({
        columnNames: ['service_provider_id'],
        referencedTableName: 'service_providers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Contact Clicks
    await queryRunner.createTable(
      new Table({
        name: 'contact_clicks',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'service_provider_id', type: 'int' },
          {
            name: 'contact_type',
            type: 'enum',
            enum: ['whatsapp', 'email', 'telefone'],
          },
          {
            name: 'clicked_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'contact_clicks',
      new TableForeignKey({
        columnNames: ['service_provider_id'],
        referencedTableName: 'service_providers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Provider Visits
    await queryRunner.createTable(
      new Table({
        name: 'provider_visits',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          {
            name: 'service_provider_id',
            type: 'int',
          },
          {
            name: 'visited_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'visit_origin',
            type: 'enum',
            enum: ['busca', 'categoria', 'home', 'destaque'],
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'provider_visits',
      new TableForeignKey({
        columnNames: ['service_provider_id'],
        referencedTableName: 'service_providers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('provider_visits');
    await queryRunner.dropTable('contact_clicks');
    await queryRunner.dropTable('reviews');
    await queryRunner.dropTable('services');
    await queryRunner.dropTable('service_providers');
    await queryRunner.dropTable('categories');
    await queryRunner.dropTable('users');
  }
}
