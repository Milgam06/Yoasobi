import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateHistoryInputDto, CreateHistoryOutputDto } from '../dto';

@Injectable()
export class CreateHistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({
    userId,
    yoasobiId,
    title,
    note,
    image,
  }: CreateHistoryInputDto & {
    userId: string;
  }): Promise<CreateHistoryOutputDto> {
    const historyId = await this.prismaService.$transaction(
      async (transaction) => {
        const yoasobi = await transaction.yoasobi.findFirst({
          where: { id: yoasobiId, userId },
          select: { id: true },
        });
        if (!yoasobi) {
          throw new NotFoundException('Yoasobi not found');
        }
        const createdHistoryId = await transaction.history.create({
          data: { userId, yoasobiId, title, note, image },
          select: { id: true },
        });

        return createdHistoryId.id;
      },
    );
    return { historyId };
  }
}
