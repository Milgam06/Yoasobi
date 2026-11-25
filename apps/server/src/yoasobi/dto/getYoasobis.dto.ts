import { Field, ObjectType } from '@nestjs/graphql';
import { YoasobiEntity } from 'entity';

@ObjectType()
export class GetYoasobisOutputDto {
  @Field(() => [YoasobiEntity])
  yoasobis: YoasobiEntity[];
}
