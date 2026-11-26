import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { HistoryEntity, YoasobiEntity } from 'entity';

@ObjectType()
export class YoasobiHistory extends PickType(
  HistoryEntity,
  ['id', 'title', 'note', 'image'],
  ObjectType,
) {}

@ObjectType()
export class YoasobiWithHistory extends YoasobiEntity {
  @Field(() => YoasobiHistory, { nullable: true })
  history: YoasobiHistory | null;
}

@ObjectType()
export class GetYoasobisWithHistoryOutputDto {
  @Field(() => [YoasobiWithHistory])
  yoasobis: YoasobiWithHistory[];
}
