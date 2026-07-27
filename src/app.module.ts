import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { MonitoringService } from './modules/monitoring/monitoring.service';
import { MonitoringController } from './modules/monitoring/monitoring.controller';
import { WebsitesModule } from './modules/websites/websites.module';
import { AuthModule } from './modules/auth/auth.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      validate: validateEnv,
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
