import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'entity';

@ObjectType()
export class GetUsersOutputDto {
  @Field(() => [UserEntity])
  users: UserEntity[];
}
