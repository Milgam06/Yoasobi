import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { GetHistoryInputDto, GetHistoryOutputDto } from '../dto';

@Injectable()
export class GetHistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({
    userId,
    historyId,
  }: GetHistoryInputDto & { userId: string }): Promise<GetHistoryOutputDto> {
    const history = await this.prismaService.history.findFirst({
      where: { id: historyId, userId },
      include: { yoasobi: true },
    });
    if (!history) {
      throw new NotFoundException('History not found');
    }
    return { history };
  }
}
