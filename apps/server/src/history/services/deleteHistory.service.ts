import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { DeleteHistoryInputDto, DeleteHistoryOutputDto } from '../dto';

@Injectable()
export class DeleteHistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({
    userId,
    historyId,
  }: DeleteHistoryInputDto & {
    userId: string;
  }): Promise<DeleteHistoryOutputDto> {
    try {
      await this.prismaService.history.delete({
        where: { id: historyId, userId },
      });
    } catch {
      throw new NotFoundException('History not found');
    }
    return { success: true };
  }
}
