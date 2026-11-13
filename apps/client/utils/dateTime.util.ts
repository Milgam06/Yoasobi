import type { DayOfWeek } from '@/libs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

type IZonedDateTimeInput = {
  utcDate: Date;
  timeZone: string;
};

type IGetLocalToUtcInput = {
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
  weekStartDate: Date;
  dayOfWeek: DayOfWeek;
  timeZone?: string;
};

type IGetWeekStartDateInput = { currentDate: Date; timeZone?: string };

export const getDateByDayOfWeekUtil = ({
  weekStartDate,
  dayOfWeek,
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
}: IGetDateByDayOfWeekInput): { dateByDayOfWeek: Date } => {
  const date = dayjs(weekStartDate).tz(timeZone).add(DAY_OF_WEEK_INDEX_MAP[dayOfWeek], 'day').format('YYYY-MM-DD');
  return { dateByDayOfWeek: dayjs.tz(date, timeZone).toDate() };
};

export const getWeekStartDateUtil = ({
  currentDate,
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
}: IGetWeekStartDateInput): { weekStartDate: Date } => {
  const weekStartDate = getWeekStartDateTimeUtil({
    utcDate: currentDate,
    timeZone,
  });
  return { weekStartDate };
};

export const getUtcToLocalUtil = ({ utcDate, timeZone }: IZonedDateTimeInput): string => {
  const localDate = dayjs(utcDate).tz(timeZone).format(LOCAL_FORMAT);
  return localDate;
};

export const getLocalToUtcUtil = ({ localDate, timeZone }: IGetLocalToUtcInput): Date => {
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

export const getWeekStartDateTimeUtil = ({ utcDate, timeZone }: IZonedDateTimeInput): Date => {
  const localDate = dayjs(utcDate).tz(timeZone);
  const sunday = localDate.subtract(localDate.day(), 'day').format('YYYY-MM-DD');
  return dayjs.tz(sunday, timeZone).toDate();
};

export const getNextMidnightUtil = ({ utcDate, timeZone }: IZonedDateTimeInput): Date => {
  const tomorrow = dayjs(utcDate).tz(timeZone).add(1, 'day').format('YYYY-MM-DD');
  return dayjs.tz(tomorrow, timeZone).toDate();
};

export const parseDateTime = (dateTime: string): Date => {
  const parsedDate = new Date(dateTime);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid DateTime: ${dateTime}`);
  }
  return parsedDate;
};
