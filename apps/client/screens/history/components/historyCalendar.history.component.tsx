import { memo, useCallback } from 'react';
import { DateData } from 'react-native-calendars';
import { BlurBox, Calendar } from '@/components';
import { Pressable } from 'react-native';
import { Circle, Text } from 'tamagui';

type IHistoryCalendarProps = {
  yearMonth: string;
  yoasobiDates: string[];
  selected?: string;
  onSelectDate: (date: string) => void;
  onMonthChange: (month: string) => void;
};

export const HistoryCalendar = memo<IHistoryCalendarProps>(
  ({ yearMonth, yoasobiDates, selected, onSelectDate, onMonthChange }) => {
    const renderDayComponent = useCallback<React.FC<{ date?: DateData }>>(
      ({ date }) => {
        if (!date) {
          return null;
        }
        const enabled = yoasobiDates.includes(date.dateString);
        const active = selected === date.dateString;
        return (
          <Pressable
            disabled={!enabled}
            onPress={() => onSelectDate(date.dateString)}
            style={{
              width: '100%',
              minHeight: 42,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 9,
              backgroundColor: active ? '#FED896' : 'transparent',
            }}>
            <Text
              fontWeight={enabled ? '$800' : '$400'}
              color={active ? '$colors.midnightPurple' : enabled ? '$colors.lampYellow' : '$colors.moonSoftWhite'}
              opacity={enabled ? 1 : 0.8}>
              {date.day}
            </Text>
            {enabled && (
              <Circle
                position="absolute"
                b="$size.x1_5"
                width="$size.x1"
                aspectRatio={1}
                bg={active ? '$colors.midnightPurple' : '$colors.lampYellow'}
              />
            )}
          </Pressable>
        );
      },
      [yoasobiDates, onSelectDate, selected],
    );

    return (
      <BlurBox px="$size.x3">
        <Calendar yearMonth={yearMonth} onMonthChange={onMonthChange} dayComponent={renderDayComponent} />
      </BlurBox>
    );
  },
);
