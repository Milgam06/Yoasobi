import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate, IsString, IsTimeZone, IsUUID } from 'class-validator';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class UserEntity {
  @Field(() => String)
  @IsUUID()
  id: string;

  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String)
  @IsTimeZone()
  timezone: string;

  @Field(() => Date)
  @IsDate()
  createdAt: Date;

  @Field(() => Date)
  @IsDate()
  updatedAt: Date;
}
