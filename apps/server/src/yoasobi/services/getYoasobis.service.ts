import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { GetYoasobisOutputDto } from '../dto';

@Injectable()
export class GetYoasobisService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({ userId }: { userId: string }): Promise<GetYoasobisOutputDto> {
    const yoasobis = await this.prismaService.yoasobi.findMany({
      where: { userId },
      orderBy: { yoasobiDate: 'desc' },
    });

    return {
      yoasobis,
    };
  }
}
