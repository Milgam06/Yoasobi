import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { DeleteYoasobiInputDto, DeleteYoasobiOutputDto } from '../dto';
import { DeleteYoasobiService } from '../services';

@Resolver()
export class DeleteYoasobiResolver {
  constructor(private readonly deleteYoasobiService: DeleteYoasobiService) {}

  @Mutation(() => DeleteYoasobiOutputDto)
  async deleteYoasobi(
    @Args('input') input: DeleteYoasobiInputDto,
  ): Promise<DeleteYoasobiOutputDto> {
    return await this.deleteYoasobiService.execute(input);
  }
}
