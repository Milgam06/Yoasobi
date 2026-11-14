import dayjs from 'dayjs';
import { createContext, memo, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { getNextMidnightUtil, getUtcToLocalUtil, getWeekStartDateTimeUtil } from '@/utils';
import { useAuth } from '../auth';

export type IDateTimeContextProps = {
  utcDate: Date;
  userLocalDate: string | null;
  deviceLocalDate: string;
  weekStartDate: Date | null;
  userTimeZone: string | null;
  deviceTimeZone: string;
  isDateTimeReady: boolean;
  refreshDateTime: () => void;
};

type IDateTimeProviderProps = {
  children: ReactNode;
};

const getCurrentDeviceDateTime = () => ({
  utcDate: new Date(),
  deviceTimeZone: dayjs.tz.guess(),
});

export const DateTimeContext = createContext<IDateTimeContextProps | null>(null);

export const DateTimeProvider = memo<IDateTimeProviderProps>(({ children }) => {
  const { appUser, isReady: isAuthReady } = useAuth();
  const [{ utcDate, deviceTimeZone }, setDateTime] = useState<{ utcDate: Date; deviceTimeZone: string }>(
    getCurrentDeviceDateTime,
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const userTimeZone = useMemo(() => {
    if (!isAuthReady || !appUser?.timezone) {
      return null;
    }
    try {
      getUtcToLocalUtil({ utcDate: new Date(0), timeZone: appUser.timezone });
      return appUser.timezone;
    } catch {
      return null;
    }
  }, [appUser?.timezone, isAuthReady]);

  const userLocalDate = userTimeZone ? getUtcToLocalUtil({ utcDate, timeZone: userTimeZone }) : null;
  const weekStartDate = userTimeZone ? getWeekStartDateTimeUtil({ utcDate, timeZone: userTimeZone }) : null;

  const refreshDateTime = useCallback(() => {
    const refresh = () => {
      clearTimeout(timeoutRef.current);
      const currentDateTime = getCurrentDeviceDateTime();
      setDateTime(currentDateTime);

      if (AppState.currentState && AppState.currentState !== 'active') {
        return;
      }
      const deviceMidnight = getNextMidnightUtil({
        utcDate: currentDateTime.utcDate,
        timeZone: currentDateTime.deviceTimeZone,
      }).getTime();
      const accountMidnight = userTimeZone
        ? getNextMidnightUtil({ utcDate: currentDateTime.utcDate, timeZone: userTimeZone }).getTime()
        : deviceMidnight;
      const nextMidnight = Math.min(deviceMidnight, accountMidnight);
      timeoutRef.current = setTimeout(refresh, Math.max(1, nextMidnight - Date.now()));
    };
    refresh();
  }, [userTimeZone]);

  useEffect(() => {
    timeoutRef.current = setTimeout(refreshDateTime, 0);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refreshDateTime();
      } else {
        clearTimeout(timeoutRef.current);
      }
    });
    return () => {
      clearTimeout(timeoutRef.current);
      subscription.remove();
    };
  }, [refreshDateTime]);

  return (
    <DateTimeContext.Provider
      value={{
        utcDate,
        userLocalDate,
        deviceLocalDate: getUtcToLocalUtil({ utcDate, timeZone: deviceTimeZone }),
        weekStartDate,
        userTimeZone,
        deviceTimeZone,
        isDateTimeReady: userTimeZone !== null,
        refreshDateTime,
      }}>
      {children}
    </DateTimeContext.Provider>
  );
});

export const useDateTime = (): IDateTimeContextProps => {
  const context = useContext(DateTimeContext);
  if (!context) {
    throw new Error('useDateTime must be used within a DateTimeProvider');
  }
  return context;
};
