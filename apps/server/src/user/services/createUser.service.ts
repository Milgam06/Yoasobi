import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateUserInputDto, CreateUserOutputDto } from '../dto';

@Injectable()
export class CreateUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({
    userId,
    name,
    timezone,
  }: CreateUserInputDto & { userId: string }): Promise<CreateUserOutputDto> {
    const user = await this.prismaService.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name,
        timezone,
      },
    });

    return { user };
  }
}
