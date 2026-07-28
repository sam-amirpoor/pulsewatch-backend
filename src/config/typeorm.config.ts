import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],

  inject: [ConfigService],

  useFactory: (config: ConfigService) => ({
    type: 'postgres',

    host: config.get<string>('database.host'),
    port: config.get<number>('database.port'),

    username: config.get<string>('database.username'),
    password: config.get<string>('database.password'),
    database: config.get<string>('database.database'),

    autoLoadEntities: true,

    synchronize: config.get<string>('app.nodeEnv') !== 'production',
    logging: config.get<string>('app.nodeEnv') === 'development',
  }),
};
