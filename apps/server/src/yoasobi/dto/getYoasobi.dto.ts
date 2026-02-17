import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate, IsUUID } from 'class-validator';
import { YoasobiEntity } from 'entity';

@InputType()
export class GetYoasobiInputDto {
  @Field(() => String)
  @IsUUID()
  userId: string;

  @Field(() => Date)
  @IsDate()
  weekStartDate: Date;
}

@ObjectType()
export class GetYoasobiOutputDto {
  @Field(() => YoasobiEntity, { nullable: true })
  yoasobi: YoasobiEntity | null;
}
