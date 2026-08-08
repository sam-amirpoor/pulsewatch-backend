import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Website } from './entities/website.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WebsitesService {
  constructor(
    @InjectRepository(Website)
    private readonly websitesRepository: Repository<Website>,
  ) {}
}
