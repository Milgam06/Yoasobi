import { CurrentUser, ICurrentUser } from 'src/auth';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateYoasobiService } from '../services';
import { CreateYoasobiInputDto, CreateYoasobiOutputDto } from '../dto';

@Resolver()
export class CreateYoasobiResolver {
  constructor(private readonly createYoasobiService: CreateYoasobiService) {}

  @Mutation(() => CreateYoasobiOutputDto)
  async createYoasobi(
    @Args('input') input: CreateYoasobiInputDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<CreateYoasobiOutputDto> {
    return await this.createYoasobiService.execute({
      ...input,
      userId: user.id,
    });
  }
}
