import { CurrentUser, ICurrentUser } from 'src/auth';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetHistoryService } from '../services';
import { GetHistoryInputDto, GetHistoryOutputDto } from '../dto';

@Resolver()
export class GetHistoryResolver {
  constructor(private readonly getHistoryService: GetHistoryService) {}

  @Query(() => GetHistoryOutputDto)
  async getHistory(
    @Args('input') input: GetHistoryInputDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<GetHistoryOutputDto> {
    return await this.getHistoryService.execute({ ...input, userId: user.id });
  }
}
