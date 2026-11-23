import { memo, useCallback } from 'react';
import { Calendar as RNCalendar, CalendarProps, LocaleConfig } from 'react-native-calendars';
import { Stack, Text } from 'tamagui';

const months = Array.from({ length: 12 }, (_, prevMonth) => {
  return prevMonth + 1 + '월';
});
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
LocaleConfig.locales.ko = {
  monthNames: months,
  monthNamesShort: months,
  dayNames: weekdays.map((day) => day + '요일'),
  dayNamesShort: weekdays,
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

type ICalendarProps = Pick<CalendarProps, 'dayComponent'> & {
  yearMonth: string;
  onMonthChange: (yearMonth: string) => void;
};

export const Calendar = memo<ICalendarProps>(({ yearMonth, onMonthChange, dayComponent }) => {
  const [year, number] = yearMonth.split('-').map(Number);

  const moveMonth = useCallback(
    (offset: number) => {
      const date = new Date(Date.UTC(year, number - 1 + offset, 1));
      onMonthChange(date.toISOString().slice(0, 7));
    },
    [year, number, onMonthChange],
  );

  const handlePreviousMonth = useCallback(() => {
    moveMonth(-1);
  }, [moveMonth]);

  const handleNextMonth = useCallback(() => {
    moveMonth(1);
  }, [moveMonth]);

  return (
    <Stack>
      <Stack flexDirection="row" items="center">
        <Text flex={1} color="$colors.moonSoftWhite" fontSize="$7" fontWeight="$800">
          {year}년 {number}월
        </Text>
        {[-1, 1].map((offset) => (
          <Stack
            key={offset}
            width="$size.x11"
            aspectRatio={1}
            items="center"
            justify="center"
            onPress={offset < 0 ? handlePreviousMonth : handleNextMonth}>
            <Text color="$colors.moonSoftWhite" fontSize="$8">
              {offset < 0 ? '‹' : '›'}
            </Text>
          </Stack>
        ))}
      </Stack>
      <RNCalendar
        initialDate={yearMonth + '-01'}
        hideExtraDays
        hideArrows
        renderHeader={() => null}
        theme={{ calendarBackground: 'transparent', textSectionTitleColor: '#FDE8D6', weekVerticalMargin: 2 }}
        dayComponent={dayComponent}
      />
    </Stack>
  );
});
