import { DayOfWeek } from '@/libs';

const DAY_OF_WEEK_INDEX_MAP: Record<DayOfWeek, number> = {
  [DayOfWeek.Sunday]: 0,
  [DayOfWeek.Monday]: 1,
  [DayOfWeek.Tuesday]: 2,
  [DayOfWeek.Wednesday]: 3,
  [DayOfWeek.Thursday]: 4,
  [DayOfWeek.Friday]: 5,
  [DayOfWeek.Saturday]: 6,
};

type IGetDateByDayOfWeekUtil = ({ weekStartDate, dayOfWeek }: { weekStartDate: Date; dayOfWeek: DayOfWeek }) => {
  dateByDayOfWeek: Date;
};

export const getDateByDayOfWeekUtil: IGetDateByDayOfWeekUtil = ({ weekStartDate, dayOfWeek }) => {
  const dateByDayOfWeek = new Date(weekStartDate);
  const dayOffset = DAY_OF_WEEK_INDEX_MAP[dayOfWeek];
  dateByDayOfWeek.setDate(dateByDayOfWeek.getDate() + dayOffset);
  dateByDayOfWeek.setHours(0, 0, 0, 0);
  return { dateByDayOfWeek };
};
