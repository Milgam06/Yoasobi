import type { DayOfWeek } from '@/libs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

type IUtcUtilInput = {
  utcDate: Date;
  timeZone: string;
};

type ILocalUtilInput = {
  localDate: string;
  timeZone: string;
};

const LOCAL_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

const DAY_OF_WEEK_INDEX_MAP: Record<DayOfWeek, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

type IGetDateByDayOfWeekInput = {
  weekStartUtcDate: Date;
  dayOfWeek: DayOfWeek;
  timeZone: string;
};

export const getUtcToLocalUtil = ({ utcDate, timeZone }: IUtcUtilInput): Date => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    calendar: 'gregory',
    numberingSystem: 'latn',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(utcDate);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const milliseconds = String(utcDate.getUTCMilliseconds()).padStart(3, '0');
  const localDate = new Date(
    `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}.${milliseconds}Z`,
  );
  return localDate;
};

export const getDateByDayOfWeekUtil = ({ weekStartUtcDate, dayOfWeek, timeZone }: IGetDateByDayOfWeekInput): Date => {
  const localWeekStartDate = getUtcToLocalUtil({ utcDate: weekStartUtcDate, timeZone });
  const date = dayjs.utc(localWeekStartDate).add(DAY_OF_WEEK_INDEX_MAP[dayOfWeek], 'day').format('YYYY-MM-DD');
  const dateByDayOfWeek = dayjs.tz(date, timeZone).toDate();
  return dateByDayOfWeek;
};

// 이거 input localDate string 타입인거 꼬롬함;;
export const getLocalToUtcUtil = ({ localDate, timeZone }: ILocalUtilInput): Date => {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/.test(localDate)) {
    throw new RangeError('Expected an ISO local date-time without an offset');
  }
  const wallClock = dayjs.utc(localDate);
  const normalized = wallClock.format(LOCAL_FORMAT);
  const [dateTime, fraction = ''] = localDate.split('.');
  const expected = `${dateTime.length === 16 ? dateTime + ':00' : dateTime}.${fraction.padEnd(3, '0')}`;
  if (!wallClock.isValid() || normalized !== expected) {
    throw new RangeError('Invalid local date-time');
  }
  const convertedDate = dayjs.tz(localDate, timeZone).toDate();
  return convertedDate;
};

export const getWeekStartDateTimeUtil = ({ utcDate, timeZone }: IUtcUtilInput): Date => {
  const localDate = getUtcToLocalUtil({ utcDate, timeZone });
  const sunday = dayjs.utc(localDate).subtract(localDate.getUTCDay(), 'day').format('YYYY-MM-DD');
  const weekStartDate = dayjs.tz(sunday, timeZone).toDate();
  return weekStartDate;
};

export const getNextMidnightUtil = ({ utcDate, timeZone }: IUtcUtilInput): Date => {
  const localDate = getUtcToLocalUtil({ utcDate, timeZone });
  const tomorrow = dayjs.utc(localDate).add(1, 'day').format('YYYY-MM-DD');
  const nextMidnight = dayjs.tz(tomorrow, timeZone).toDate();
  return nextMidnight;
};

export const parseDateTime = (dateTime: string): Date => {
  const parsedDate = new Date(dateTime);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid DateTime: ${dateTime}`);
  }
  return parsedDate;
};
