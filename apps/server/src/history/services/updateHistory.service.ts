import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { UpdateHistoryInputDto, UpdateHistoryOutputDto } from '../dto';

@Injectable()
export class UpdateHistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({
    userId,
    historyId,
    title,
    note,
    image,
  }: UpdateHistoryInputDto & {
    userId: string;
  }): Promise<UpdateHistoryOutputDto> {
    try {
      await this.prismaService.history.update({
        where: { id: historyId, userId },
        data: { title, note, image },
      });
    } catch {
      throw new NotFoundException('History not found');
    }
    return { success: true };
  }
}
