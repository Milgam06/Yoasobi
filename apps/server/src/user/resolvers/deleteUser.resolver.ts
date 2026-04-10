import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { DeleteUserService } from '../services';
import { DeleteUserInputDto, DeleteUserOutputDto } from '../dto';

@Resolver()
export class DeleteUserResolver {
  constructor(private readonly deleteUserService: DeleteUserService) {}

  @Mutation(() => DeleteUserOutputDto)
  async deleteUser(
    @Args('input') input: DeleteUserInputDto,
  ): Promise<DeleteUserOutputDto> {
    return await this.deleteUserService.execute(input);
  }
}
