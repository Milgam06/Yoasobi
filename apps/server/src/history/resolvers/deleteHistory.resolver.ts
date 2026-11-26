import { CurrentUser, ICurrentUser } from 'src/auth';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { DeleteHistoryService } from '../services';
import { DeleteHistoryInputDto, DeleteHistoryOutputDto } from '../dto';

@Resolver()
export class DeleteHistoryResolver {
  constructor(private readonly deleteHistoryService: DeleteHistoryService) {}

  @Mutation(() => DeleteHistoryOutputDto)
  async deleteHistory(
    @Args('input') input: DeleteHistoryInputDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<DeleteHistoryOutputDto> {
    return await this.deleteHistoryService.execute({
      ...input,
      userId: user.id,
    });
  }
}
