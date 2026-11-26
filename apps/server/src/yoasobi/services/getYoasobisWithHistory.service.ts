import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { GetYoasobisWithHistoryOutputDto } from '../dto';

@Injectable()
export class GetYoasobisWithHistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({
    userId,
  }: {
    userId: string;
  }): Promise<GetYoasobisWithHistoryOutputDto> {
    const yoasobis = await this.prismaService.yoasobi.findMany({
      where: { userId },
      include: { history: { where: { userId } } },
      orderBy: { yoasobiDate: 'desc' },
    });

    return {
      yoasobis,
    };
  }
}
