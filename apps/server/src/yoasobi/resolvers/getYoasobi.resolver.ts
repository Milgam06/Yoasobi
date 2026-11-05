import { CurrentUser, ICurrentUser } from 'src/auth';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetYoasobiInputDto, GetYoasobiOutputDto } from '../dto';
import { GetYoasobiService } from '../services';

@Resolver()
export class GetYoasobiResolver {
  constructor(private readonly getYoasobiService: GetYoasobiService) {}

  @Query(() => GetYoasobiOutputDto)
  async getYoasobi(
    @Args('input') input: GetYoasobiInputDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<GetYoasobiOutputDto> {
    return await this.getYoasobiService.execute({ ...input, userId: user.id });
  }
}
