import { CurrentUser, ICurrentUser } from 'src/auth';
import { Query, Resolver } from '@nestjs/graphql';
import { GetHistoriesService } from '../services';
import { GetHistoriesOutputDto } from '../dto';

@Resolver()
export class GetHistoriesResolver {
  constructor(private readonly getHistoriesService: GetHistoriesService) {}

  @Query(() => GetHistoriesOutputDto)
  async getHistories(
    @CurrentUser() user: ICurrentUser,
  ): Promise<GetHistoriesOutputDto> {
    return await this.getHistoriesService.execute({ userId: user.id });
  }
}
