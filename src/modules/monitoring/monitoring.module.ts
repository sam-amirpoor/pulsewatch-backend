import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoringResult } from './entities/monitoring-result.entity';

@Module({
  providers: [MonitoringService],
  controllers: [MonitoringController],
  imports: [TypeOrmModule.forFeature([MonitoringResult])],
})
export class MonitoringModule {}
