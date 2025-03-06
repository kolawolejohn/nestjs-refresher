import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class DestinationService {
  public constructor(private readonly prisma: PrismaService) {}

  async createDestination(user_id: string, dto: CreateDestinationDto) {
    return await this.prisma.destination.create({
      data: {
        ...dto,
        travel_date: new Date(dto.travel_date).toISOString(),
        user_id,
      },
    });
  }

  private async findOne(user: User) {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!currentUser) {
      throw new UnauthorizedException(
        'Invalid credentials, you are not authorised for this action',
      );
    }

    return currentUser;
  }

  private async findOneDestination(id: string) {
    const destination = await this.prisma.destination.findUnique({
      where: { id },
    });

    if (!destination) {
      throw new UnauthorizedException('Invalid destination');
    }
    return destination;
  }

  async findAllUserDestinations(user: User) {
    const currentUser = await this.findOne(user);
    return await this.prisma.destination.findMany({
      where: { user_id: currentUser.id },
      include: { user: true },
    });
  }

  async findDestinationById(user: User, id: string) {
    const currentUser = await this.findOne(user);
    const destination = await this.findOneDestination(id);

    if (destination.user_id !== currentUser.id) {
      throw new UnauthorizedException(
        'You are not authorized to access this destination',
      );
    }

    return await this.prisma.destination.findUnique({
      where: {
        user_id: currentUser.id,
        id: destination.id,
      },
      include: { user: true },
    });
  }

  async updateUserDestination(
    user: User,
    id: string,
    dto: UpdateDestinationDto,
  ) {
    const currentUser = await this.findOne(user);
    const destination = await this.findOneDestination(id);

    if (destination.user_id !== currentUser.id) {
      throw new UnauthorizedException(
        'You are not authorized to access this destination',
      );
    }

    if (dto.travel_date) {
      dto.travel_date = new Date(dto.travel_date).toISOString();
    }

    return await this.prisma.destination.update({
      where: {
        user_id: currentUser.id,
        id: destination.id,
      },
      data: {
        ...dto,
      },
      include: { user: true },
    });
  }

  async deleteDestination(user: User, id: string) {
    const currentUser = await this.findOne(user);
    const destination = await this.findOneDestination(id);
    if (destination.user_id !== currentUser.id) {
      throw new UnauthorizedException(
        'You are not authorized to access this destination',
      );
    }
    return await this.prisma.destination.delete({
      where: {
        user_id: currentUser.id,
        id: destination.id,
      },
    });
  }
}
