import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateYoasobiInputDto, CreateYoasobiOutputDto } from '../dto';
import { GetWeekStartDateUtilService } from 'src/utils';

@Injectable()
export class CreateYoasobiService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly getWeekStartDateUtilService: GetWeekStartDateUtilService,
  ) {}

  async execute({
    userId,
    yoasobiDate,
    dayOfWeek,
    alarmTime,
    duration,
  }: CreateYoasobiInputDto): Promise<CreateYoasobiOutputDto> {
    const { weekStartDate } =
      this.getWeekStartDateUtilService.execute(yoasobiDate);
    const yoasobi = await this.prismaService.yoasobi.create({
      data: {
        userId,
        yoasobiDate,
        dayOfWeek,
        weekStartDate,
        alarmTime,
        duration,
      },
    });

    return {
      yoasobi,
    };
  }
}
