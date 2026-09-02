type IParseDateTime = (dateTime: string) => Date;

export const parseDateTime: IParseDateTime = (dateTime) => {
  const parsedDate = new Date(dateTime);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid DateTime: ${dateTime}`);
  }
  return parsedDate;
};
