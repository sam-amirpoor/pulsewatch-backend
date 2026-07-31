import { Module } from '@nestjs/common';
import { WebsitesController } from './websites.controller';
import { WebsitesService } from './websites.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Website } from './entities/website.entity';

@Module({
  controllers: [WebsitesController],
  providers: [WebsitesService],
  imports: [TypeOrmModule.forFeature([Website])],
})
export class WebsitesModule {}
