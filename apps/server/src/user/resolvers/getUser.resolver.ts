import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetUserInputDto, GetUserOutputDto } from '../dto';
import { GetUserService } from '../services';

@Resolver()
export class GetUserResolver {
  constructor(private readonly getUserService: GetUserService) {}

  @Query(() => GetUserOutputDto)
  async getUser(
    @Args('input') input: GetUserInputDto,
  ): Promise<GetUserOutputDto> {
    return await this.getUserService.execute(input);
  }
}
