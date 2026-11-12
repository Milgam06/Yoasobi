import { createContext, memo, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { getNextMidnightUtil, getUtcToLocalUtil, getWeekStartDateTimeUtil } from '@/utils';
import { useAuth } from '../auth';

export type IDateTimeContextProps = {
  utcDate: Date;
  // ISO wall-clock strings; interpret each using its corresponding time zone.
  localDate: string | null;
  deviceLocalDate: string;
  weekStartDate: Date | null;
  userTimeZone: string | null;
  deviceTimeZone: string;
  isReady: boolean;
  getNow: () => Date;
  refreshDateTime: () => void;
};

type IDateTimeProviderProps = {
  children: ReactNode;
};

const getCurrentDateTime = () => ({
  utcDate: new Date(),
  deviceTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

export const DateTimeContext = createContext<IDateTimeContextProps | null>(null);

export const DateTimeProvider = memo<IDateTimeProviderProps>(({ children }) => {
  const { appUser, isReady: isAuthReady } = useAuth();
  const [{ utcDate, deviceTimeZone }, setDateTime] = useState(getCurrentDateTime);
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

  const refreshDateTime = useCallback(
    function refresh() {
      clearTimeout(timeoutRef.current);
      const currentDateTime = getCurrentDateTime();
      setDateTime(currentDateTime);

      if (AppState.currentState && AppState.currentState !== 'active') {
        return;
      }
      const timeZones = userTimeZone
        ? [userTimeZone, currentDateTime.deviceTimeZone]
        : [currentDateTime.deviceTimeZone];
      const nextMidnight = Math.min(
        ...timeZones.map((timeZone) => getNextMidnightUtil({ utcDate: currentDateTime.utcDate, timeZone }).getTime()),
      );
      timeoutRef.current = setTimeout(refresh, Math.max(1, nextMidnight - Date.now()));
    },
    [userTimeZone],
  );

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

  const value = useMemo<IDateTimeContextProps>(() => {
    const localDate = userTimeZone ? getUtcToLocalUtil({ utcDate, timeZone: userTimeZone }) : null;
    const weekStartDate = userTimeZone ? getWeekStartDateTimeUtil({ utcDate, timeZone: userTimeZone }) : null;

    return {
      utcDate,
      localDate,
      deviceLocalDate: getUtcToLocalUtil({ utcDate, timeZone: deviceTimeZone }),
      weekStartDate,
      userTimeZone,
      deviceTimeZone,
      isReady: userTimeZone !== null,
      getNow: () => new Date(),
      refreshDateTime,
    };
  }, [utcDate, userTimeZone, deviceTimeZone, refreshDateTime]);

  return <DateTimeContext.Provider value={value}>{children}</DateTimeContext.Provider>;
});

export const useDateTime = (): IDateTimeContextProps => {
  const context = useContext(DateTimeContext);
  if (!context) {
    throw new Error('useDateTime must be used within a DateTimeProvider');
  }
  return context;
};
