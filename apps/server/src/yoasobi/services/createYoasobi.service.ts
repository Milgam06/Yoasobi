import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateYoasobiInputDto, CreateYoasobiOutputDto } from '../dto';

@Injectable()
export class CreateYoasobiService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({
    userId,
    yoasobiDate,
    dayOfWeek,
  }: CreateYoasobiInputDto): Promise<CreateYoasobiOutputDto> {
    const yoasobi = await this.prismaService.yoasobi.create({
      data: {
        userId,
        yoasobiDate,
        dayOfWeek,
      },
    });

    return {
      yoasobi,
    };
  }
}
