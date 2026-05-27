import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { DeleteUserInputDto, DeleteUserOutputDto } from '../dto';

@Injectable()
export class DeleteUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async execute({ userId }: DeleteUserInputDto): Promise<DeleteUserOutputDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prismaService.user.delete({
      where: { id: userId },
    });

    return { success: true };
  }
}
