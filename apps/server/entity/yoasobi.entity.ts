import { DayOfWeek } from '@generated-prisma/enums';
import {
  Field,
  Int,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsDate, IsEnum, IsInt, IsUUID } from 'class-validator';

registerEnumType(DayOfWeek, {
  name: 'DayOfWeek',
});

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class YoasobiEntity {
  @Field(() => String)
  @IsUUID()
  id: string;

  @Field(() => String)
  @IsUUID()
  userId: string;

  @Field(() => DayOfWeek)
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @Field(() => Date)
  @IsDate()
  yoasobiDate: Date;

  @Field(() => Date)
  @IsDate()
  weekStartDate: Date;

  @Field(() => Date)
  @IsDate()
  alarmTime: Date;

  @Field(() => Int)
  @IsInt()
  duration: number;

  @Field(() => Date)
  @IsDate()
  createdAt: Date;
}
