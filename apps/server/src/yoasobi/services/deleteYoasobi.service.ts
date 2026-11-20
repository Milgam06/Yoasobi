import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { DeleteYoasobiInputDto, DeleteYoasobiOutputDto } from '../dto';

@Injectable()
export class DeleteYoasobiService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({
    yoasobiId,
    userId,
  }: DeleteYoasobiInputDto & {
    userId: string;
  }): Promise<DeleteYoasobiOutputDto> {
    const { count } = await this.prismaService.yoasobi.deleteMany({
      where: { id: yoasobiId, userId },
    });
    if (count === 0) {
      throw new NotFoundException('Yoasobi not found');
    }
    return { success: true };
  }
}
