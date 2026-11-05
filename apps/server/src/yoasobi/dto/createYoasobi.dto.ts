import { DayOfWeek } from '@generated-prisma/enums';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsDate, IsEnum, IsInt, Min, Max } from 'class-validator';
import { YoasobiEntity } from 'entity';

@InputType()
export class CreateYoasobiInputDto {
  @Field(() => DayOfWeek)
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @Field(() => Date)
  @IsDate()
  yoasobiDate: Date;

  @Field(() => Date)
  @IsDate()
  alarmTime: Date;

  @Field(() => Int)
  @IsInt()
  @Min(10)
  @Max(180)
  duration: number;
}

@ObjectType()
export class CreateYoasobiOutputDto {
  @Field(() => YoasobiEntity)
  yoasobi: YoasobiEntity;
}
