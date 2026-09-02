import { BlurBox, DefaultLayout } from '@/components';
import {
  DAY_OF_WEEK_ARRAY,
  DAY_OF_WEEK_TEXT,
  MAX_YOASOBI_DURATION_MINUTES,
  MIN_YOASOBI_DURATION_MINUTES,
  MS_PER_DAY,
} from '@/constants';
import { DayOfWeek, useCreateYoasobiMutation, useGetWeeklyYoasobiLazyQuery } from '@/libs';
import { getDateByDayOfWeekUtil, getWeekStartDateUtil, parseDateTime } from '@/utils';
import { faAlarmClock } from '@fortawesome/free-solid-svg-icons/faAlarmClock';
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons/faStopwatch';
import { faBurst } from '@fortawesome/free-solid-svg-icons/faBurst';
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFocusEffect } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Button, ColorTokens, Progress, ScrollView, Separator, Sheet, Stack, Switch, Text } from 'tamagui';
import { Platform } from 'react-native';
import { useAuth } from '@/providers';

type IYoasobi = {
  id: string;
  yoasobiDate: Date;
  dayOfWeek: DayOfWeek;
  alarmTime: Date;
  duration: number;
  createdAt: Date;
};

type IYoasobiChoiceBoxProps = {
  selectedDayOfWeek: DayOfWeek;
  selectableDaysOfWeek: DayOfWeek[];
  isMidnightNotificationEnabled: boolean;
  isShowStartTime: boolean;
  isShowDuration: boolean;
  startTimeValue: Date;
  durationValue: number;
  onPressShowStartTime: () => void;
  onPressShowDuration: () => void;
  onCloseStartTime: () => void;
  onCloseDuration: () => void;
  onPressDay: (day: DayOfWeek) => void;
  onPressRandomDay: () => void;
  onChangeStartTime: (event: DateTimePickerEvent, date?: Date) => void;
  onIncreaseDuration: () => void;
  onDecreaseDuration: () => void;
  onCheckMidnightNotification: (checked: boolean) => void;
};

type IYoasobiResultBoxProps = {
  yoasobiDay: DayOfWeek;
  yoasobiDate: Date;
  createdDate: Date;
};

const isSameLocalDate = (firstDate: Date, secondDate: Date) =>
  firstDate.getFullYear() === secondDate.getFullYear() &&
  firstDate.getMonth() === secondDate.getMonth() &&
  firstDate.getDate() === secondDate.getDate();

const getSelectableDaysOfWeek = (currentDate: Date) => DAY_OF_WEEK_ARRAY.slice(currentDate.getDay() + 1);

const getYoasobiDateForDay = ({
  weekStartDate,
  dayOfWeek,
  previousDate,
}: {
  weekStartDate: Date;
  dayOfWeek: DayOfWeek;
  previousDate: Date;
}) => {
  const { dateByDayOfWeek } = getDateByDayOfWeekUtil({ weekStartDate, dayOfWeek });
  dateByDayOfWeek.setHours(previousDate.getHours(), previousDate.getMinutes(), 0, 0);
  return dateByDayOfWeek;
};

const YoasobiChoiceBox = memo<IYoasobiChoiceBoxProps>(
  ({
    selectedDayOfWeek,
    selectableDaysOfWeek,
    isMidnightNotificationEnabled,
    isShowStartTime,
    isShowDuration,
    startTimeValue,
    durationValue,
    onPressShowStartTime,
    onPressShowDuration,
    onCloseStartTime,
    onCloseDuration,
    onPressDay,
    onPressRandomDay,
    onCheckMidnightNotification,
    onChangeStartTime,
    onIncreaseDuration,
    onDecreaseDuration,
  }) => {
    const isPlatformAndroid = Platform.OS === 'android';

    const startTimeText = useMemo(() => {
      const hours = startTimeValue.getHours().toString().padStart(2, '0');
      const minutes = startTimeValue.getMinutes().toString().padStart(2, '0');
      return `${hours} : ${minutes}`;
    }, [startTimeValue]);

    return (
      <BlurBox>
        <Stack width="$fluid" justify="center" items="center" gap="$size.x5">
          <Stack width="$fluid" justify="center" gap="$size.x1">
            <Text fontSize="$5" color="$colors.cloudGray">
              Weekly Pick
            </Text>
            <Text fontSize="$7" fontWeight="$900" color="$colors.moonSoftWhite">
              요일을 뽑거나, 직접 골라보세요!
            </Text>
          </Stack>
          <Stack width="$fluid" justify="center" gap="$size.x2_5">
            <Stack width="$fluid" flexDirection="row" justify="space-between" items="center">
              {DAY_OF_WEEK_ARRAY.map((day) => {
                const isDaySelectable = selectableDaysOfWeek.includes(day);
                const isDayActive = isDaySelectable && day === selectedDayOfWeek;
                const backgroundColor: ColorTokens = isDayActive ? '$colors.moonSoftWhite' : '$colors.midnightPurple';
                const fontColor: ColorTokens = isDayActive ? '$colors.midnightPurple' : '$colors.moonSoftWhite';
                const borderColor: ColorTokens = isDayActive ? '$colors.midnightPurple' : '$colors.cloudGray';
                return (
                  <Stack
                    key={day}
                    width="$size.x9"
                    height="$size.x12"
                    justify="center"
                    items="center"
                    bg={backgroundColor}
                    borderWidth={1}
                    borderColor={borderColor}
                    opacity={isDaySelectable ? 1 : 0.35}
                    animation="quick"
                    style={{ borderRadius: 8 }}
                    aria-disabled={!isDaySelectable}
                    aria-checked={isDayActive}
                    disabled={!isDaySelectable}
                    pressStyle={{ opacity: 0.6 }}
                    onPress={() => onPressDay(day)}>
                    <Text fontSize="$7" fontWeight="$900" color={fontColor}>
                      {DAY_OF_WEEK_TEXT[day]}
                    </Text>
                  </Stack>
                );
              })}
            </Stack>
            <Stack
              width="$fluid"
              flexDirection="row"
              justify="center"
              items="center"
              py="$size.x2"
              bg="$colors.moonSoftWhite"
              gap="$size.x1_5"
              borderWidth={1}
              borderColor="$colors.cloudGray"
              style={{ borderRadius: 12 }}
              pressStyle={{ opacity: 0.6 }}
              onPress={onPressRandomDay}>
              <FontAwesomeIcon size={20} icon={faBurst} color="#313252" />
              <Text fontSize="$7" fontWeight="$800" color="$colors.midnightPurple">
                랜덤 뽑기
              </Text>
            </Stack>
          </Stack>
          <Stack
            width="$fluid"
            borderWidth={1}
            borderColor="$colors.moonSoftWhite"
            px="$size.x4"
            py="$size.x3"
            gap="$size.x2_5"
            style={{ borderRadius: 8 }}>
            <Stack
              width="$fluid"
              flexDirection="row"
              justify="space-between"
              items="center"
              onPress={onPressShowStartTime}>
              <Stack flexDirection="row" items="center" gap="$size.x2">
                <FontAwesomeIcon size={24} icon={faClock} color="#FDE8D6" />
                <Text fontSize="$7" fontWeight="$800" color="$colors.moonSoftWhite">
                  시작 시간
                </Text>
              </Stack>
              <Text fontSize="$8" fontWeight="$700" color="$colors.moonSoftWhite">
                {startTimeText}
              </Text>
            </Stack>
            {isPlatformAndroid ? (
              isShowStartTime && (
                <RNDateTimePicker value={startTimeValue} mode="time" display="spinner" onChange={onChangeStartTime} />
              )
            ) : (
              <Sheet
                modal
                open={isShowStartTime}
                onOpenChange={(open: boolean) => !open && onCloseStartTime()}
                snapPoints={[36]}
                dismissOnSnapToBottom
                animation="quick">
                <Sheet.Overlay
                  animation="medium"
                  enterStyle={{ opacity: 1 }}
                  exitStyle={{ opacity: 0 }}
                  bg="rgba(0,0,0,0.4)"
                />
                <Sheet.Frame
                  p="$size.x4"
                  items="center"
                  justify="center"
                  bg="$colors.midnightPurple"
                  borderTopLeftRadius="$size.x3"
                  borderTopRightRadius="$size.x3">
                  <Stack width="$fluid" justify="center" items="flex-end" px="$size.x1">
                    <Stack justify="center" items="center" onPress={onCloseStartTime}>
                      <Text fontSize="$5" fontWeight="$700" color="$colors.moonSoftWhite">
                        완료
                      </Text>
                    </Stack>
                  </Stack>
                  <RNDateTimePicker
                    value={startTimeValue}
                    mode="time"
                    display="spinner"
                    textColor="#FDE8D6"
                    onChange={onChangeStartTime}
                  />
                </Sheet.Frame>
              </Sheet>
            )}
            <Separator width="$fluid" borderColor="$colors.moonSoftWhite" />
            <Stack
              width="$fluid"
              flexDirection="row"
              justify="space-between"
              items="center"
              onPress={onPressShowDuration}>
              <Stack flexDirection="row" items="center" gap="$size.x2">
                <FontAwesomeIcon size={24} icon={faStopwatch} color="#FDE8D6" />
                <Text fontSize="$7" fontWeight="$800" color="$colors.moonSoftWhite">
                  소요 시간
                </Text>
              </Stack>
              <Text fontSize="$8" fontWeight="$700" color="$colors.moonSoftWhite">
                {durationValue} 분
              </Text>
            </Stack>
            {isShowDuration && (
              <Sheet
                modal
                open={isShowDuration}
                onOpenChange={(open: boolean) => !open && onCloseDuration()}
                snapPoints={[32]}
                moveOnKeyboardChange
                dismissOnSnapToBottom
                animation="quick">
                <Sheet.Overlay
                  animation="medium"
                  enterStyle={{ opacity: 1 }}
                  exitStyle={{ opacity: 0 }}
                  bg="rgba(0,0,0,0.4)"
                />
                <Sheet.Frame
                  p="$size.x4"
                  items="center"
                  justify="center"
                  bg="$colors.midnightPurple"
                  borderTopLeftRadius="$size.x3"
                  borderTopRightRadius="$size.x3">
                  <Stack flex={1} width="$fluid" px="$size.x1" gap="$size.x3">
                    <Stack width="$fluid" flexDirection="row" justify="space-between" px="$size.x1">
                      <Text fontSize="$7" fontWeight="$900" color="$colors.moonSoftWhite">
                        소요 시간
                      </Text>
                      <Stack justify="center" items="center" onPress={onCloseDuration}>
                        <Text fontSize="$5" fontWeight="$700" color="$colors.moonSoftWhite">
                          완료
                        </Text>
                      </Stack>
                    </Stack>
                    <Stack width="$fluid" px="$size.x2">
                      <Text color="$colors.cloudGray">
                        최소 {MIN_YOASOBI_DURATION_MINUTES}분 / 최대 {MAX_YOASOBI_DURATION_MINUTES}분
                      </Text>
                    </Stack>
                    <Stack
                      width="$fluid"
                      flexDirection="row"
                      justify="space-between"
                      items="center"
                      px="$size.x5"
                      py="$size.x6"
                      borderWidth={1}
                      borderColor="$colors.cloudGray"
                      bg="$colors.midnightPurple_Darker"
                      style={{ borderRadius: 20 }}>
                      <Stack
                        width="$fit"
                        p="$size.x5"
                        bg="$colors.midnightPurple"
                        borderWidth={1}
                        borderColor="$colors.cloudGray"
                        style={{ borderRadius: 16 }}
                        onPress={onDecreaseDuration}>
                        <FontAwesomeIcon size={26} color="#858090" icon={faMinus} />
                      </Stack>
                      <Stack
                        justify="center"
                        items="center"
                        px="$size.x6"
                        py="$size.x3"
                        bg="$colors.midnightPurple"
                        style={{ borderRadius: 16 }}>
                        <Text fontSize="$10" fontWeight="$800" color="$colors.moonSoftWhite">
                          {durationValue}
                        </Text>
                        <Text fontSize="$5" color="$colors.moonSoftWhite">
                          분
                        </Text>
                      </Stack>
                      <Stack
                        width="$fit"
                        p="$size.x5"
                        bg="$colors.midnightPurple"
                        borderWidth={1}
                        borderColor="$colors.cloudGray"
                        style={{ borderRadius: 16 }}
                        onPress={onIncreaseDuration}>
                        <FontAwesomeIcon size={26} color="#858090" icon={faPlus} />
                      </Stack>
                    </Stack>
                  </Stack>
                </Sheet.Frame>
              </Sheet>
            )}
          </Stack>
          <Stack
            width="$fluid"
            flexDirection="row"
            justify="space-between"
            items="center"
            px="$size.x6"
            py="$size.x4"
            borderWidth={1}
            boxShadow={isMidnightNotificationEnabled ? '0 0 16px #fed89660' : 'none'}
            borderColor={isMidnightNotificationEnabled ? '$colors.lampYellow' : '$colors.cloudGray'}
            animation="quickest"
            style={{ borderRadius: 8 }}>
            <Stack flexDirection="row" justify="center" items="center" gap="$size.x3">
              <FontAwesomeIcon size={28} icon={faBell} color={isMidnightNotificationEnabled ? '#FED896' : '#858090'} />
              <Text
                fontSize="$7"
                fontWeight="$800"
                color={isMidnightNotificationEnabled ? '$colors.lampYellow' : '$colors.cloudGray'}
                animation="quickest">
                새벽 알림
              </Text>
            </Stack>
            <Switch
              size="$x11"
              defaultChecked={isMidnightNotificationEnabled}
              bg={isMidnightNotificationEnabled ? '$colors.lampYellow' : '$colors.midnightPurple'}
              animation="quickest"
              onCheckedChange={(checked) => onCheckMidnightNotification(checked)}>
              <Switch.Thumb animation="quick" bg="$colors.moonSoftWhite" />
            </Switch>
          </Stack>
        </Stack>
      </BlurBox>
    );
  },
);

const YoasobiWeekCompleteBox = memo(() => (
  <BlurBox>
    <Stack width="$fluid" justify="center" items="center" gap="$size.x3" py="$size.x8">
      <FontAwesomeIcon
        size={36}
        icon={faMoon}
        color="#FED896"
        style={{
          shadowColor: '#FED896',
          shadowOpacity: 1,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 0 },
        }}
      />
      <Stack justify="center" items="center" gap="$size.x1_5">
        <Text style={{ textAlign: 'center' }} fontSize="$8" fontWeight="$900" color="$colors.moonSoftWhite">
          이번 주 YOASOBI를 모두 즐겼어요
        </Text>
        <Text style={{ textAlign: 'center' }} fontSize="$5" color="$colors.cloudGray">
          다음 주에 새로운 새벽 산책을 정해보세요.
        </Text>
      </Stack>
    </Stack>
  </BlurBox>
));

const YoasobiResultBox = memo<IYoasobiResultBoxProps>(({ yoasobiDay, yoasobiDate, createdDate }) => {
  const yoasobiDateText = `${yoasobiDate.getHours()}:${yoasobiDate.getMinutes().toString().padStart(2, '0')}`;

  const now = new Date();
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yoasobiStart = new Date(yoasobiDate.getFullYear(), yoasobiDate.getMonth(), yoasobiDate.getDate()).getTime();
  const remainingDays = Math.max(0, Math.ceil((yoasobiStart - nowStart) / MS_PER_DAY));
  const isDday = remainingDays <= 0;
  const ddayText = isDday ? 'D-DAY' : `D-${remainingDays}`;

  const nowDateTime = now.getTime();
  const yoasobiDateTime = yoasobiDate.getTime();
  const createdDateTime = createdDate.getTime();
  const totalDuration = yoasobiDateTime - createdDateTime;
  const elapsedTime = Math.max(0, Math.min(totalDuration, nowDateTime - createdDateTime));
  const elapsedProgress = totalDuration > 0 ? Math.round((elapsedTime / totalDuration) * 100) : 0;
  return (
    <BlurBox>
      <Stack width="$fluid" justify="center" items="center" gap="$size.x4">
        <Stack width="$fluid" flexDirection="row" justify="space-between" items="flex-start">
          <Stack flex={1} justify="center" gap="$size.x1_5">
            <Text fontSize="$4" color="$colors.cloudGray">
              Your YOASOBI day
            </Text>
            <Text fontSize="$9" fontWeight="$900" color="$colors.moonSoftWhite">
              {DAY_OF_WEEK_TEXT[yoasobiDay]}요일
            </Text>
            <Text fontSize="$6" fontWeight="$400" color="$colors.moonSoftWhite">
              {yoasobiDateText} 알림
            </Text>
          </Stack>
          <Stack
            width="$fit"
            aspectRatio={1}
            justify="center"
            items="center"
            p="$size.x3"
            bg="$colors.streetBlack"
            style={{ borderRadius: 50 }}>
            <FontAwesomeIcon
              size={30}
              icon={faMoon}
              color="#FED896"
              style={{
                shadowColor: '#FED896',
                shadowOpacity: 1,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 0 },
              }}
            />
          </Stack>
        </Stack>
        <Stack
          width="$fluid"
          justify="center"
          items="center"
          gap="$size.x4"
          px="$size.x5"
          py="$size.x4"
          bg="$colors.streetBlack"
          borderWidth={1}
          borderColor="$colors.midnightPurple"
          style={{ borderRadius: 16 }}>
          <Stack width="$fluid" flexDirection="row" justify="space-between" items="center">
            <Stack flexDirection="row" justify="center" items="center" gap="$size.x2">
              <FontAwesomeIcon size={14} icon={faAlarmClock} color="#FDE8D6" />
              <Text fontSize="$5" fontWeight="$300" color="$colors.moonSoftWhite">
                카운트다운
              </Text>
            </Stack>
            <Text
              fontSize="$6"
              fontWeight="$700"
              color={isDday ? '$colors.lampYellow' : '$colors.moonSoftWhite'}
              {...(isDday && {
                shadowColor: '$colors.moonSoftWhite',
                shadowOpacity: 1,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 0 },
              })}>
              {ddayText}
            </Text>
          </Stack>
          <Progress size="$x10" bg="$colors.midnightPurple" value={elapsedProgress}>
            <Progress.Indicator
              animation="slow"
              bg={elapsedProgress > 80 ? '$colors.lampYellow' : '$colors.cloudGray'}
            />
          </Progress>
        </Stack>
      </Stack>
    </BlurBox>
  );
});

export const HomeScreen = memo(() => {
  const { userId, isReady } = useAuth();

  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const { weekStartDate } = useMemo(() => getWeekStartDateUtil({ currentDate }), [currentDate]);
  const selectableDaysOfWeek = useMemo(() => getSelectableDaysOfWeek(currentDate), [currentDate]);
  const initialSelectedDayOfWeek = selectableDaysOfWeek[0] ?? null;

  const [isMidnightNotificationEnabled, setIsMidnightNotificationEnabled] = useState<boolean>(false);
  const [existedYoasobi, setExistedYoasobi] = useState<IYoasobi | null>(null);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<DayOfWeek | null>(initialSelectedDayOfWeek);
  const [newYoasobiDate, setNewYoasobiDate] = useState<Date>(() => {
    if (!initialSelectedDayOfWeek) {
      return new Date(currentDate);
    }

    return getYoasobiDateForDay({
      weekStartDate,
      dayOfWeek: initialSelectedDayOfWeek,
      previousDate: currentDate,
    });
  });
  const [duration, setDuration] = useState<number>(MIN_YOASOBI_DURATION_MINUTES);
  const [isStartTimeSheetOpen, setIsStartTimeSheetOpen] = useState<boolean>(false);
  const [isDurationSheetOpen, setIsDurationSheetOpen] = useState<boolean>(false);
  const [getWeeklyYoasobiQuery] = useGetWeeklyYoasobiLazyQuery();
  const [createYoasobiMutation] = useCreateYoasobiMutation();

  const handlePressDay = useCallback(
    (day: DayOfWeek) => {
      if (!selectableDaysOfWeek.includes(day)) {
        return;
      }
      setSelectedDayOfWeek(day);
      setNewYoasobiDate((previousDate) => getYoasobiDateForDay({ weekStartDate, dayOfWeek: day, previousDate }));
    },
    [selectableDaysOfWeek, weekStartDate],
  );

  const handleCheckMidnightNotification = useCallback((checked: boolean) => {
    setIsMidnightNotificationEnabled(checked);
  }, []);

  const handleShowStartTimeSheet = useCallback(() => {
    setIsDurationSheetOpen(false);
    setIsStartTimeSheetOpen(true);
  }, []);

  const handleShowDurationSheet = useCallback(() => {
    setIsStartTimeSheetOpen(false);
    setIsDurationSheetOpen(true);
  }, []);

  const handleCloseStartTimeSheet = useCallback(() => {
    setIsStartTimeSheetOpen(false);
  }, []);

  const handleCloseDurationSheet = useCallback(() => {
    setIsDurationSheetOpen(false);
  }, []);

  const handleChangeStartTime = useCallback((event: DateTimePickerEvent, startTime?: Date) => {
    if (Platform.OS === 'android') {
      setIsStartTimeSheetOpen(false);
    }

    const isStartTimeUpdated = event.type === 'set' && startTime;
    if (!isStartTimeUpdated) {
      return;
    }
    setNewYoasobiDate((prev) => {
      const updatedDate = new Date(prev);
      updatedDate.setHours(startTime.getHours());
      updatedDate.setMinutes(startTime.getMinutes());
      return updatedDate;
    });
  }, []);

  const handleIncreaseDuration = useCallback(() => {
    setDuration((prev) => {
      const isDurationReachedMax = prev >= MAX_YOASOBI_DURATION_MINUTES;
      if (isDurationReachedMax) {
        return prev;
      }
      return prev + 5;
    });
  }, []);

  const handleDecreaseDuration = useCallback(() => {
    setDuration((prev) => {
      const isDurationReachedMin = prev <= MIN_YOASOBI_DURATION_MINUTES;
      if (isDurationReachedMin) {
        return prev;
      }
      return prev - 5;
    });
  }, []);

  const handlePressRandomDay = useCallback(() => {
    if (selectableDaysOfWeek.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * selectableDaysOfWeek.length);
    const selectedRandomDay = selectableDaysOfWeek[randomIndex];

    handlePressDay(selectedRandomDay);
  }, [handlePressDay, selectableDaysOfWeek]);

  const fetchWeeklyYoasobi = useCallback(async () => {
    if (!userId) {
      return;
    }
    const { data } = await getWeeklyYoasobiQuery({
      variables: {
        input: {
          userId,
          weekStartDate: weekStartDate.toISOString(),
        },
      },
    });
    const yoasobi = data?.getYoasobi.yoasobi;
    setExistedYoasobi(
      yoasobi
        ? {
            ...yoasobi,
            yoasobiDate: parseDateTime(yoasobi.yoasobiDate),
            alarmTime: parseDateTime(yoasobi.alarmTime),
            createdAt: parseDateTime(yoasobi.createdAt),
          }
        : null,
    );
  }, [getWeeklyYoasobiQuery, userId, weekStartDate]);

  const createNewYoasobi = useCallback(async () => {
    const isSelectedDayValid = selectedDayOfWeek && selectableDaysOfWeek.includes(selectedDayOfWeek);
    if (!userId || !isSelectedDayValid) {
      return;
    }
    const { data } = await createYoasobiMutation({
      variables: {
        input: {
          userId,
          dayOfWeek: selectedDayOfWeek,
          yoasobiDate: newYoasobiDate.toISOString(),
          alarmTime: newYoasobiDate.toISOString(),
          duration,
        },
      },
      fetchPolicy: 'network-only',
    });

    const createdYoasobi = data?.createYoasobi.yoasobi;

    setExistedYoasobi(
      createdYoasobi
        ? {
            ...createdYoasobi,
            yoasobiDate: parseDateTime(createdYoasobi.yoasobiDate),
            alarmTime: parseDateTime(createdYoasobi.alarmTime),
            createdAt: parseDateTime(createdYoasobi.createdAt),
          }
        : null,
    );
  }, [createYoasobiMutation, duration, newYoasobiDate, selectableDaysOfWeek, selectedDayOfWeek, userId]);

  const handlePressCreateYoasobi = useCallback(async () => {
    await createNewYoasobi();
  }, [createNewYoasobi]);

  useEffect(() => {
    if (isReady && userId) {
      fetchWeeklyYoasobi();
    }
  }, [userId, isReady, fetchWeeklyYoasobi]);

  useEffect(() => {
    if (selectedDayOfWeek && selectableDaysOfWeek.includes(selectedDayOfWeek)) {
      return;
    }

    const nextSelectedDayOfWeek = selectableDaysOfWeek[0] ?? null;
    setSelectedDayOfWeek(nextSelectedDayOfWeek);

    if (nextSelectedDayOfWeek) {
      setNewYoasobiDate((previousDate) =>
        getYoasobiDateForDay({
          weekStartDate,
          dayOfWeek: nextSelectedDayOfWeek,
          previousDate,
        }),
      );
    }
  }, [selectableDaysOfWeek, selectedDayOfWeek, weekStartDate]);

  useFocusEffect(
    useCallback(() => {
      const focusedDate = new Date();
      setCurrentDate((previousDate) => (isSameLocalDate(previousDate, focusedDate) ? previousDate : focusedDate));
    }, []),
  );

  const isCreationAvailable = selectedDayOfWeek !== null && selectableDaysOfWeek.length > 0;

  return (
    <DefaultLayout isBlur hasHeader>
      <ScrollView flex={1}>
        <Stack flex={1} px="$size.x2" gap="$size.x4">
          <Stack pt="$size.x4" gap="$size.x1_5">
            <Text fontSize="$7" fontWeight="$500" color="$colors.cloudGray">
              이번주 YOASOBI 를 정해요!
            </Text>
            <Text fontSize="$9" fontWeight="$700" color="$colors.moonSoftWhite">
              새벽 산책 해볼까요?
            </Text>
          </Stack>
          {existedYoasobi ? (
            <YoasobiResultBox
              yoasobiDay={existedYoasobi.dayOfWeek}
              yoasobiDate={existedYoasobi.yoasobiDate}
              createdDate={existedYoasobi.createdAt}
            />
          ) : isCreationAvailable ? (
            <Stack flex={1} width="$fluid" gap="$size.x6">
              <YoasobiChoiceBox
                selectedDayOfWeek={selectedDayOfWeek}
                selectableDaysOfWeek={selectableDaysOfWeek}
                isMidnightNotificationEnabled={isMidnightNotificationEnabled}
                isShowStartTime={isStartTimeSheetOpen}
                isShowDuration={isDurationSheetOpen}
                startTimeValue={newYoasobiDate}
                durationValue={duration}
                onChangeStartTime={(event, date) => handleChangeStartTime(event, date)}
                onIncreaseDuration={handleIncreaseDuration}
                onDecreaseDuration={handleDecreaseDuration}
                onPressShowStartTime={handleShowStartTimeSheet}
                onPressShowDuration={handleShowDurationSheet}
                onCloseStartTime={handleCloseStartTimeSheet}
                onCloseDuration={handleCloseDurationSheet}
                onPressDay={handlePressDay}
                onPressRandomDay={handlePressRandomDay}
                onCheckMidnightNotification={handleCheckMidnightNotification}
              />
              <Button
                width="$fluid"
                height="auto"
                py="$size.x2"
                bg="$colors.lampYellow"
                borderTopLeftRadius="$size.x4"
                borderTopRightRadius="$size.x4"
                borderBottomLeftRadius="$size.x4"
                borderBottomRightRadius="$size.x4"
                pressStyle={{
                  bg: '$colors.lampYellow',
                  opacity: 0.8,
                  scale: 0.98,
                }}
                onPress={handlePressCreateYoasobi}>
                <Text fontSize="$8" fontWeight="$800" color="$colors.midnightPurple">
                  생성하기
                </Text>
              </Button>
            </Stack>
          ) : (
            <YoasobiWeekCompleteBox />
          )}
        </Stack>
      </ScrollView>
    </DefaultLayout>
  );
});
