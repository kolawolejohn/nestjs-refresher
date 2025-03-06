import { Module } from '@nestjs/common';
import { DestinationService } from './destination.service';
import { DestinationController } from './destination.controller';
import { HttpModule } from '@nestjs/axios';
import { HttpResponse } from 'src/responses/http.response';

@Module({
  imports: [HttpModule],
  controllers: [DestinationController],
  providers: [DestinationService, HttpResponse],
})
export class DestinationModule {}
