import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignInUserInputDto, SignInUserOutputDto } from '../dto';
import { SignInUserService } from '../services';

@Resolver()
export class SignInUserResolver {
  constructor(private readonly signInUserService: SignInUserService) {}

  @Mutation(() => SignInUserOutputDto)
  async signInUser(
    @Args('input') input: SignInUserInputDto,
  ): Promise<SignInUserOutputDto> {
    return await this.signInUserService.execute(input);
  }
}
