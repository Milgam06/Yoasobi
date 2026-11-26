import { CurrentUser, ICurrentUser } from 'src/auth';
import { Query, Resolver } from '@nestjs/graphql';
import { GetYoasobisWithHistoryOutputDto } from '../dto';
import { GetYoasobisWithHistoryService } from '../services';

@Resolver()
export class GetYoasobisWithHistoryResolver {
  constructor(
    private readonly getYoasobisWithHistoryService: GetYoasobisWithHistoryService,
  ) {}

  @Query(() => GetYoasobisWithHistoryOutputDto)
  async getYoasobisWithHistory(
    @CurrentUser() user: ICurrentUser,
  ): Promise<GetYoasobisWithHistoryOutputDto> {
    return await this.getYoasobisWithHistoryService.execute({
      userId: user.id,
    });
  }
}
