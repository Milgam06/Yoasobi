import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteUserInputDto {
  @Field(() => String)
  @IsUUID()
  userId: string;
}

@ObjectType()
export class DeleteUserOutputDto {
  @Field(() => Boolean)
  success: boolean;
}
