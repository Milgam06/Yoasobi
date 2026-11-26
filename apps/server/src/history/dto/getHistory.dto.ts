import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { HistoryEntity } from 'entity';

@InputType()
export class GetHistoryInputDto {
  @Field(() => String)
  @IsUUID()
  historyId: string;
}

@ObjectType()
export class GetHistoryOutputDto {
  @Field(() => HistoryEntity)
  history: HistoryEntity;
}
