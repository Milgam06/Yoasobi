import { DayOfWeek } from '@/libs';

export const DAY_OF_WEEK_ARRAY: DayOfWeek[] = [
  DayOfWeek.Sunday,
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
];

export const DAY_OF_WEEK_TEXT: Record<DayOfWeek, string> = {
  [DayOfWeek.Sunday]: '일',
  [DayOfWeek.Monday]: '월',
  [DayOfWeek.Tuesday]: '화',
  [DayOfWeek.Wednesday]: '수',
  [DayOfWeek.Thursday]: '목',
  [DayOfWeek.Friday]: '금',
  [DayOfWeek.Saturday]: '토',
};
