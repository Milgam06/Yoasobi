import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate, IsString, IsTimeZone, IsUUID } from 'class-validator';

@InputType()
export class SignInUserInputDto {
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
export class SignInUserOutputDto {
  @Field(() => String)
  @IsUUID()
  userId: string;

  @Field(() => String)
  @IsDate()
  createdAt: Date;
}
