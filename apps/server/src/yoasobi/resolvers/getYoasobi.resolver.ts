import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetYoasobiInputDto, GetYoasobiOutputDto } from '../dto';
import { GetYoasobiService } from '../services';

@Resolver()
export class GetYoasobiResolver {
  constructor(private readonly getYoasobiService: GetYoasobiService) {}

  @Query(() => GetYoasobiOutputDto)
  async getYoasobi(
    @Args('input') input: GetYoasobiInputDto,
  ): Promise<GetYoasobiOutputDto> {
    return await this.getYoasobiService.execute(input);
  }
}
