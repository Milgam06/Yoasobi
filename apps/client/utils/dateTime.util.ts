import { Temporal } from '@js-temporal/polyfill';

type IGetUtcToLocalInput = {
  utcDate: Date;
  timeZone: string;
};

type IGetLocalToUtcInput = {
  // ISO local date-time without an offset, interpreted in timeZone.
  localDate: string;
  timeZone: string;
};

const getZonedDateTime = ({ utcDate, timeZone }: IGetUtcToLocalInput) =>
  Temporal.Instant.fromEpochMilliseconds(utcDate.getTime()).toZonedDateTimeISO(timeZone);

// Local values are wall-clock representations, not shifted Date instances.
export const getUtcToLocalUtil = (input: IGetUtcToLocalInput): string =>
  getZonedDateTime(input).toPlainDateTime().toString();

export const getLocalToUtcUtil = ({ localDate, timeZone }: IGetLocalToUtcInput): Date => {
  const date = Temporal.PlainDateTime.from(localDate).toZonedDateTime(timeZone, { disambiguation: 'reject' });
  return new Date(date.epochMilliseconds);
};

export const getWeekStartDateTimeUtil = (input: IGetUtcToLocalInput): Date => {
  const localDate = getZonedDateTime(input);
  const weekStartDate = localDate.subtract({ days: localDate.dayOfWeek % 7 }).startOfDay();
  return new Date(weekStartDate.epochMilliseconds);
};

export const getNextMidnightUtil = (input: IGetUtcToLocalInput): Date => {
  const midnight = getZonedDateTime(input).toPlainDate().add({ days: 1 }).toZonedDateTime(input.timeZone);
  return new Date(midnight.epochMilliseconds);
};
