import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteHistoryInputDto {
  @Field(() => String)
  @IsUUID()
  historyId: string;
}

@ObjectType()
export class DeleteHistoryOutputDto {
  @Field()
  success: boolean;
}
