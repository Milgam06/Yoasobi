import { Field, ObjectType } from '@nestjs/graphql';
import { HistoryEntity } from 'entity';

@ObjectType()
export class GetHistoriesOutputDto {
  @Field(() => [HistoryEntity])
  histories: HistoryEntity[];
}
