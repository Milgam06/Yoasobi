import { getWeekStartDateTimeUtil } from './dateTime.util';

type IGetWeekStartDateUtil = (input: { currentDate: Date; timeZone?: string }) => { weekStartDate: Date };

export const getWeekStartDateUtil: IGetWeekStartDateUtil = ({ currentDate, timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone }) => {
  const weekStartDate = getWeekStartDateTimeUtil({
    utcDate: currentDate,
    timeZone,
  });
  return { weekStartDate: weekStartDate };
};
