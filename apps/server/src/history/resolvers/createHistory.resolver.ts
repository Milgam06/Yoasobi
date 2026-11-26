import { CurrentUser, ICurrentUser } from 'src/auth';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateHistoryService } from '../services';
import { CreateHistoryInputDto, CreateHistoryOutputDto } from '../dto';

@Resolver()
export class CreateHistoryResolver {
  constructor(private readonly createHistoryService: CreateHistoryService) {}

  @Mutation(() => CreateHistoryOutputDto)
  async createHistory(
    @Args('input') input: CreateHistoryInputDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<CreateHistoryOutputDto> {
    return await this.createHistoryService.execute({
      ...input,
      userId: user.id,
    });
  }
}
