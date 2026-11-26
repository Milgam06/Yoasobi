import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { GetHistoriesOutputDto } from '../dto';

@Injectable()
export class GetHistoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({
    userId,
  }: {
    userId: string;
  }): Promise<GetHistoriesOutputDto> {
    const histories = await this.prismaService.history.findMany({
      where: { userId },
    });
    return { histories };
  }
}
