import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsArray, IsDate, IsString, IsUUID } from 'class-validator';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class HistoryEntity {
  @Field(() => String)
  @IsUUID()
  id: string;

  @Field(() => String)
  @IsUUID()
  yoasobiId: string;

  @Field(() => String)
  @IsUUID()
  userId: string;

  @Field(() => String)
  @IsString()
  note: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  image: string[];

  @Field(() => Date)
  @IsDate()
  createdAt: Date;
}
