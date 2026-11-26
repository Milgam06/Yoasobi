import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import {
  GetHistoryWithYoasobiInputDto,
  GetHistoryWithYoasobiOutputDto,
} from '../dto';

@Injectable()
export class GetHistoryWithYoasobiService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({
    userId,
    historyId,
  }: GetHistoryWithYoasobiInputDto & {
    userId: string;
  }): Promise<GetHistoryWithYoasobiOutputDto> {
    const historyWithYoasobi = await this.prismaService.history.findFirst({
      where: { id: historyId, userId },
      include: { yoasobi: true },
    });
    if (!historyWithYoasobi) {
      throw new NotFoundException('History not found');
    }
    return { history: historyWithYoasobi, yoasobi: historyWithYoasobi.yoasobi };
  }
}
