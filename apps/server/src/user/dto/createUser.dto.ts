import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, IsTimeZone, IsUUID } from 'class-validator';
import { UserEntity } from 'entity';

@InputType()
export class CreateUserInputDto {
  @Field(() => String)
  @IsUUID()
  userId: string;

  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String)
  @IsTimeZone()
  timezone: string;
}

@ObjectType()
export class CreateUserOutputDto {
  @Field(() => UserEntity)
  user: UserEntity;
}
