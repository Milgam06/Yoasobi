import { Injectable } from '@nestjs/common';
import dayjs = require('dayjs');
import utc = require('dayjs/plugin/utc');
import timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

import {
  GetWeekStartDateByTimezoneInputDto,
  GetWeekStartDateByTimezoneOutputDto,
} from '../dto';

@Injectable()
export class GetWeekStartDateByTimezoneService {
  execute({
    date,
    timezone: timeZone,
  }: GetWeekStartDateByTimezoneInputDto): GetWeekStartDateByTimezoneOutputDto {
    const localDate = dayjs(date).tz(timeZone);
    const sunday = localDate
      .subtract(localDate.day(), 'day')
      .format('YYYY-MM-DD');
    const weekStartDate = dayjs.tz(sunday, timeZone).toDate();
    return { weekStartDate };
  }
}
