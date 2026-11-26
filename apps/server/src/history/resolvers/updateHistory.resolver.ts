import { CurrentUser, ICurrentUser } from 'src/auth';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UpdateHistoryService } from '../services';
import { UpdateHistoryInputDto, UpdateHistoryOutputDto } from '../dto';

@Resolver()
export class UpdateHistoryResolver {
  constructor(private readonly updateHistoryService: UpdateHistoryService) {}

  @Mutation(() => UpdateHistoryOutputDto)
  async updateHistory(
    @Args('input') input: UpdateHistoryInputDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<UpdateHistoryOutputDto> {
    return await this.updateHistoryService.execute({
      ...input,
      userId: user.id,
    });
  }
}
