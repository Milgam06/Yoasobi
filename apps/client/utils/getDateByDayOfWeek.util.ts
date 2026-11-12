import { DayOfWeek } from '@/libs';
import { Temporal } from '@js-temporal/polyfill';

const DAY_OF_WEEK_INDEX_MAP: Record<DayOfWeek, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

type IGetDateByDayOfWeekUtil = (input: { weekStartDate: Date; dayOfWeek: DayOfWeek; timeZone?: string }) => {
  dateByDayOfWeek: Date;
};

export const getDateByDayOfWeekUtil: IGetDateByDayOfWeekUtil = ({
  weekStartDate,
  dayOfWeek,
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
}) => {
  const localWeekStartDate = Temporal.Instant.fromEpochMilliseconds(weekStartDate.getTime()).toZonedDateTimeISO(
    timeZone,
  );
  const dayOffset = DAY_OF_WEEK_INDEX_MAP[dayOfWeek];
  const dateByDayOfWeek = localWeekStartDate.add({ days: dayOffset }).startOfDay();
  return { dateByDayOfWeek: new Date(dateByDayOfWeek.epochMilliseconds) };
};
