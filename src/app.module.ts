import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { MonitoringService } from './modules/monitoring/monitoring.service';
import { MonitoringController } from './modules/monitoring/monitoring.controller';
import { WebsitesModule } from './modules/websites/websites.module';
import { AuthModule } from './modules/auth/auth.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),
    UsersModule,
    MonitoringModule,
    AuthModule,
    WebsitesModule,
  ],
  controllers: [MonitoringController],
  providers: [MonitoringService],
})
export class AppModule {}
