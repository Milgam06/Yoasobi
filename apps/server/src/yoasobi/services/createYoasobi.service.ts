import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateYoasobiInputDto, CreateYoasobiOutputDto } from '../dto';
import { GetWeekStartDateByTimezoneService } from 'src/utils';

@Injectable()
export class CreateYoasobiService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly getWeekStartDateUtilService: GetWeekStartDateByTimezoneService,
  ) {}

  async execute({
    userId,
    yoasobiDate,
    dayOfWeek,
    alarmTime,
    duration,
  }: CreateYoasobiInputDto & {
    userId: string;
  }): Promise<CreateYoasobiOutputDto> {
    const { timezone } = await this.prismaService.user.findUniqueOrThrow({
      where: { id: userId },
      select: { timezone: true },
    });
    const { weekStartDate } = this.getWeekStartDateUtilService.execute({
      date: yoasobiDate,
      timezone,
    });
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
