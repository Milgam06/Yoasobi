import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { SignInUserInputDto, SignInUserOutputDto } from '../dto';

@Injectable()
export class SignInUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({
    userId,
    name,
    timezone,
  }: SignInUserInputDto): Promise<SignInUserOutputDto> {
    const { id, createdAt } = await this.prismaService.user.create({
      data: {
        id: userId,
        name,
        timezone,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });
    return { userId: id, createdAt };
  }
}
