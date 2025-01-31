import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'spendify',
  password: process.env.DB_PASSWORD || 'spendify',
  database: process.env.DB_NAME || 'spendify',
  entities: [__dirname + '/../**/*.entity.{js,ts}'], // Busca entidades en todo el proyecto
  synchronize: true, // Solo en desarrollo, no en producción,
};

export default config;
