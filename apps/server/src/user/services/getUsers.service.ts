import { ForbiddenException, Injectable } from '@nestjs/common';
import { GetUsersOutputDto } from '../dto';

@Injectable()
export class GetUsersService {
  async execute(): Promise<GetUsersOutputDto> {
    throw new ForbiddenException('User list access is not allowed');
  }
}
