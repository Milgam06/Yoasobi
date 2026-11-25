import { CurrentUser, ICurrentUser } from 'src/auth';
import { Query, Resolver } from '@nestjs/graphql';
import { GetYoasobisOutputDto } from '../dto';
import { GetYoasobisService } from '../services';

@Resolver()
export class GetYoasobisResolver {
  constructor(private readonly getYoasobisService: GetYoasobisService) {}

  @Query(() => GetYoasobisOutputDto)
  async getYoasobis(
    @CurrentUser() user: ICurrentUser,
  ): Promise<GetYoasobisOutputDto> {
    return await this.getYoasobisService.execute({ userId: user.id });
  }
}
