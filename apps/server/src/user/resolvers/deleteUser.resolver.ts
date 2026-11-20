import { CurrentUser, ICurrentUser } from 'src/auth';
import { Mutation, Resolver } from '@nestjs/graphql';
import { DeleteUserService } from '../services';
import { DeleteUserOutputDto } from '../dto';

@Resolver()
export class DeleteUserResolver {
  constructor(private readonly deleteUserService: DeleteUserService) {}

  @Mutation(() => DeleteUserOutputDto)
  async deleteUser(
    @CurrentUser() user: ICurrentUser,
  ): Promise<DeleteUserOutputDto> {
    return await this.deleteUserService.execute({ userId: user.id });
  }
}
