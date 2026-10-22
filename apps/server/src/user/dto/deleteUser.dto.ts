import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteUserOutputDto {
  @Field(() => Boolean)
  success: boolean;
}
