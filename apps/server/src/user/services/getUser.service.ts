import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { GetUserOutputDto } from '../dto';

@Injectable()
export class GetUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({ userId }: { userId: string }): Promise<GetUserOutputDto> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    return {
      user,
    };
  }
}
