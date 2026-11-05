import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';
import { YoasobiEntity } from 'entity';

@InputType()
export class GetYoasobiInputDto {
  @Field(() => Date)
  @IsDate()
  weekStartDate: Date;
}

@ObjectType()
export class GetYoasobiOutputDto {
  @Field(() => YoasobiEntity, { nullable: true })
  yoasobi: YoasobiEntity | null;
}
