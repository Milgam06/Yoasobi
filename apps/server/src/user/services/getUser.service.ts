import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { GetUserInputDto, GetUserOutputDto } from '../dto';

@Injectable()
export class GetUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({ userId }: GetUserInputDto): Promise<GetUserOutputDto> {
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
