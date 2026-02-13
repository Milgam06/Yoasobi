import { DayOfWeek } from '@generated-prisma/enums';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsDate, IsEnum, IsInt, IsUUID } from 'class-validator';
import { YoasobiEntity } from 'entity';

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

  @Field(() => String)
  @IsDate()
  alarmTime: Date;

  @Field(() => Int)
  @IsInt()
  duration: number;
}

@ObjectType()
export class CreateYoasobiOutputDto {
  @Field(() => YoasobiEntity)
  yoasobi: YoasobiEntity;
}
