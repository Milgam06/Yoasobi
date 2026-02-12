import { DayOfWeek } from '@generated-prisma/enums';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsDate, IsEnum, IsUUID } from 'class-validator';

registerEnumType(DayOfWeek, {
  name: 'DayOfWeek',
});

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class YoasobiDto {
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

  @Field(() => String)
  @IsDate()
  createdAt: Date;
}
