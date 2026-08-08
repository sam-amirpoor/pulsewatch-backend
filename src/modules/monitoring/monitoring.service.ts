import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitoringResult } from './entities/monitoring-result.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MonitoringService {
  constructor(
    @InjectRepository(MonitoringResult)
    private readonly monitoringResultsRepository: Repository<MonitoringResult>,
  ) {}
}
