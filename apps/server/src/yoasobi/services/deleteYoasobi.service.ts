import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { DeleteYoasobiInputDto, DeleteYoasobiOutputDto } from '../dto';

@Injectable()
export class DeleteYoasobiService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({
    yoasobiId,
  }: DeleteYoasobiInputDto): Promise<DeleteYoasobiOutputDto> {
    await this.prismaService.yoasobi.delete({
      where: { id: yoasobiId },
    });
    return { success: true };
  }
}
