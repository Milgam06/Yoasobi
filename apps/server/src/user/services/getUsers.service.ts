import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { GetUsersOutputDto } from '../dto';

@Injectable()
export class GetUsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(): Promise<GetUsersOutputDto> {
    const users = await this.prismaService.user.findMany();

    return { users };
  }
}
