import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'entity';

@ObjectType()
export class GetUserOutputDto {
  @Field(() => UserEntity, { nullable: true })
  user: UserEntity | null;
}
