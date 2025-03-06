import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { DestinationService } from './destination.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/get-user.decorator';
import { Response } from 'express';
import { HttpResponse } from 'src/responses/http.response';

@Controller('destination')
@UseGuards(JwtAuthGuard)
export class DestinationController {
  constructor(
    private readonly destinationService: DestinationService,
    private readonly response: HttpResponse,
  ) {}

  @Post('new')
  async createDestination(
    @Res() res: Response,
    @CurrentUser() user: User,
    @Body() createDestinationDto: CreateDestinationDto,
  ) {
    const data = await this.destinationService.createDestination(
      user.id,
      createDestinationDto,
    );

    return this.response.createdResponse(
      res,
      'Destination created Successfully',
      data,
    );
  }

  @Get()
  async findAllUserDestinations(
    @Res() res: Response,
    @CurrentUser() user: User,
  ) {
    const data = await this.destinationService.findAllUserDestinations(user);
    return this.response.okResponse(
      res,
      'Destinations fetched Successfully',
      data,
    );
  }

  @Get(':id')
  async findDestinationById(
    @Res() res: Response,
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    const data = await this.destinationService.findDestinationById(user, id);
    return this.response.okResponse(
      res,
      'Destination fetched Successfully',
      data,
    );
  }

  @Patch(':id')
  async updateUserDestination(
    @Res() res: Response,
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateDestinationDto,
  ) {
    const data = await this.destinationService.updateUserDestination(
      user,
      id,
      dto,
    );
    return this.response.okResponse(
      res,
      'Destination updated Successfully',
      data,
    );
  }

  @Delete(':id')
  async deleteDestination(
    @Res() res: Response,
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    const data = await this.destinationService.deleteDestination(user, id);
    return this.response.noContentResponse(
      res,
      'Destination updated Successfully',
      data,
    );
  }
}
