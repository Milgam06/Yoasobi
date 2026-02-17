type IGetWeekStartDateUtil = ({ currentDate }: { currentDate: Date }) => { weekStartDate: Date };

export const getWeekStartDateUtil: IGetWeekStartDateUtil = ({ currentDate }) => {
  const weekStartDate = new Date(currentDate);
  weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
  weekStartDate.setHours(0, 0, 0, 0);
  return { weekStartDate };
};
