import { CurrentUser, ICurrentUser } from 'src/auth';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserService } from '../services';
import { CreateUserInputDto, CreateUserOutputDto } from '../dto';

@Resolver()
export class CreateUserResolver {
  constructor(private readonly createUserService: CreateUserService) {}

  @Mutation(() => CreateUserOutputDto)
  async createUser(
    @Args('input') input: CreateUserInputDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<CreateUserOutputDto> {
    return await this.createUserService.execute({ ...input, userId: user.id });
  }
}
