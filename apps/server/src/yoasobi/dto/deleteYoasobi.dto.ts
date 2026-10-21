import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteYoasobiInputDto {
  @Field()
  @IsUUID()
  yoasobiId: string;
}

@ObjectType()
export class DeleteYoasobiOutputDto {
  @Field()
  success: boolean;
}
