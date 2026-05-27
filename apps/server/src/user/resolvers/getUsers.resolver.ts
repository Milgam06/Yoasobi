import { Query, Resolver } from '@nestjs/graphql';
import { GetUsersService } from '../services';
import { GetUsersOutputDto } from '../dto';

@Resolver()
export class GetUsersResolver {
  constructor(private readonly getUsersService: GetUsersService) {}

  @Query(() => GetUsersOutputDto)
  async getUsers(): Promise<GetUsersOutputDto> {
    return await this.getUsersService.execute();
  }
}
