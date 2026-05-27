import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { UserEntity } from 'entity';

@InputType()
export class GetUserInputDto {
  @Field(() => String)
  @IsUUID()
  userId: string;
}

@ObjectType()
export class GetUserOutputDto {
  @Field(() => UserEntity, { nullable: true })
  user: UserEntity | null;
}
