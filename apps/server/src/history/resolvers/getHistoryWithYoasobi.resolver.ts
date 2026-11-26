import { CurrentUser, ICurrentUser } from 'src/auth';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetHistoryWithYoasobiService } from '../services';
import { GetHistoryWithYoasobiInputDto, GetHistoryWithYoasobiOutputDto } from '../dto';

@Resolver()
export class GetHistoryWithYoasobiResolver {
  constructor(private readonly getHistoryWithYoasobiService: GetHistoryWithYoasobiService) {}

  @Query(() => GetHistoryWithYoasobiOutputDto)
  async getHistoryWithYoasobi(
    @Args('input') input: GetHistoryWithYoasobiInputDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<GetHistoryWithYoasobiOutputDto> {
    return await this.getHistoryWithYoasobiService.execute({ ...input, userId: user.id });
  }
}
