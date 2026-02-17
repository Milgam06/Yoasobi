import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { GetYoasobiInputDto, GetYoasobiOutputDto } from '../dto';

@Injectable()
export class GetYoasobiService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({
    userId,
    weekStartDate,
  }: GetYoasobiInputDto): Promise<GetYoasobiOutputDto> {
    const yoasobi = await this.prismaService.yoasobi.findUnique({
      where: {
        userId_weekStartDate: {
          userId,
          weekStartDate,
        },
      },
    });

    return {
      yoasobi,
    };
  }
}
