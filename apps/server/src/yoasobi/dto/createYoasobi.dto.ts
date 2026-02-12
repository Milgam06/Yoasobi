import { DayOfWeek } from '@generated-prisma/enums';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate, IsEnum, IsUUID } from 'class-validator';
import { YoasobiDto } from 'dto';

@InputType()
export class CreateYoasobiInputDto {
  @Field(() => String)
  @IsUUID()
  userId: string;

  @Field(() => DayOfWeek)
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @Field(() => Date)
  @IsDate()
  yoasobiDate: Date;
}

@ObjectType()
export class CreateYoasobiOutputDto {
  @Field(() => YoasobiDto)
  yoasobi: YoasobiDto;
}
