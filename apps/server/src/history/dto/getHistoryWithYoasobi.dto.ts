import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { HistoryEntity, YoasobiEntity } from 'entity';

@InputType()
export class GetHistoryWithYoasobiInputDto {
  @Field(() => String)
  @IsUUID()
  historyId: string;
}

@ObjectType()
export class GetHistoryWithYoasobiOutputDto {
  @Field(() => HistoryEntity)
  history: HistoryEntity;

  @Field(() => YoasobiEntity)
  yoasobi: YoasobiEntity;
}
