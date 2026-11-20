import { CurrentUser, ICurrentUser } from 'src/auth';
import { Query, Resolver } from '@nestjs/graphql';
import { GetUserOutputDto } from '../dto';
import { GetUserService } from '../services';

@Resolver()
export class GetUserResolver {
  constructor(private readonly getUserService: GetUserService) {}

  @Query(() => GetUserOutputDto)
  async getUser(@CurrentUser() user: ICurrentUser): Promise<GetUserOutputDto> {
    return await this.getUserService.execute({ userId: user.id });
  }
}
