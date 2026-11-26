import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsArray, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateHistoryInputDto {
  @Field(() => String)
  @IsUUID()
  yoasobiId: string;

  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String)
  @IsString()
  note: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  image: string[];
}

@ObjectType()
export class CreateHistoryOutputDto {
  @Field(() => String)
  historyId: string;
}
