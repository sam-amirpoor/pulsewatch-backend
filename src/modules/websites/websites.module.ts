import { Module } from '@nestjs/common';
import { WebsitesController } from './websites.controller';
import { WebsitesService } from './websites.service';

@Module({
  controllers: [WebsitesController],
  providers: [WebsitesService],
})
export class WebsitesModule {}
