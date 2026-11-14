import { Alert, BlurBox, DefaultLayout } from '@/components';
import {
  DAY_OF_WEEK_ARRAY,
  DAY_OF_WEEK_TEXT,
  MAX_YOASOBI_DURATION_MINUTES,
  MIN_YOASOBI_DURATION_MINUTES,
  MS_PER_DAY,
} from '@/constants';
import { DayOfWeek, useCreateYoasobiMutation, useGetWeeklyYoasobiLazyQuery } from '@/libs';
import { getLocalToUtcUtil, getUtcToLocalUtil, parseDateTime } from '@/utils';
import { faAlarmClock } from '@fortawesome/free-solid-svg-icons/faAlarmClock';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons/faStopwatch';
import { faBurst } from '@fortawesome/free-solid-svg-icons/faBurst';
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import RNDateTimePicker, { DateTimePickerChangeEvent } from '@react-native-community/datetimepicker';
import {
  AlertDialog,
  Button,
  ColorTokens,
  Progress,
  RadioGroup,
  ScrollView,
  Separator,
  Sheet,
  Spinner,
  Stack,
  Text,
} from 'tamagui';
import { Platform } from 'react-native';
import { useAuth, useDateTime } from '@/providers';
import { useBottomTabBarHeight } from 'expo-router/js-tabs';

type IHomeScreenAlert = 'fetchingIssue' | 'creationIssue' | null;

type IYoasobiChoiceBoxSheetType = 'startTime' | 'duration' | null;

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
  activeSheet: IYoasobiChoiceBoxSheetType;
  startTimeValue: Date;
  userTimeZone: string;
  durationValue: number;
  onPressShowStartTime: () => void;
  onPressShowDuration: () => void;
  onCloseActiveSheet: () => void;
  onPressDay: (day: DayOfWeek) => void;
  onPressRandomDay: () => void;
  onChangeStartTime: (event: DateTimePickerChangeEvent, date: Date) => void;
  onIncreaseDuration: () => void;
  onDecreaseDuration: () => void;
  onCheckMidnightNotification: (checked: boolean) => void;
};

type IYoasobiResultBoxProps = {
  yoasobiDate: Date;
  createdDate: Date;
};

const YoasobiChoiceBox = memo<IYoasobiChoiceBoxProps>(
  ({
    selectedDayOfWeek,
    selectableDaysOfWeek,
    isMidnightNotificationEnabled,
    activeSheet,
    startTimeValue,
    userTimeZone,
    durationValue,
    onPressShowStartTime,
    onPressShowDuration,
    onCloseActiveSheet,
    onPressDay,
    onPressRandomDay,
    onCheckMidnightNotification,
    onChangeStartTime,
    onIncreaseDuration,
    onDecreaseDuration,
  }) => {
    const isPlatformAndroid = Platform.OS === 'android';

    const isShowStartTime = activeSheet === 'startTime';
    const isShowDuration = activeSheet === 'duration';

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
            <RadioGroup
              width="$fluid"
              flexDirection="row"
              justify="space-between"
              items="center"
              orientation="horizontal"
              value={selectedDayOfWeek}
              onValueChange={(value) => {
                const day = DAY_OF_WEEK_ARRAY.find((day) => day === value);
                if (day !== undefined) {
                  onPressDay(day);
                }
              }}>
              {DAY_OF_WEEK_ARRAY.map((day) => {
                const isDaySelectable = selectableDaysOfWeek.includes(day);
                const isDayActive = isDaySelectable && day === selectedDayOfWeek;
                const backgroundColor: ColorTokens = isDayActive ? '$colors.moonSoftWhite' : '$colors.midnightPurple';
                const fontColor: ColorTokens = isDayActive ? '$colors.midnightPurple' : '$colors.moonSoftWhite';
                const borderColor: ColorTokens = isDayActive ? '$colors.midnightPurple' : '$colors.cloudGray';
                return (
                  <RadioGroup.Item
                    key={day}
                    value={day}
                    unstyled
                    width="$size.x9"
                    height="$size.x12"
                    justify="center"
                    items="center"
                    bg={backgroundColor}
                    borderWidth={1}
                    borderColor={borderColor}
                    opacity={isDaySelectable ? 1 : 0.35}
                    animation="quick"
                    borderRadius={8}
                    disabled={!isDaySelectable}
                    pressStyle={{ opacity: 0.6 }}>
                    <Text fontSize="$7" fontWeight="$900" color={fontColor}>
                      {DAY_OF_WEEK_TEXT[day]}
                    </Text>
                  </RadioGroup.Item>
                );
              })}
            </RadioGroup>
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
                  시작 시간 ({userTimeZone})
                </Text>
              </Stack>
              <Text fontSize="$8" fontWeight="$700" color="$colors.moonSoftWhite">
                {startTimeText}
              </Text>
            </Stack>
            {isPlatformAndroid ? (
              isShowStartTime && (
                <RNDateTimePicker
                  value={startTimeValue}
                  mode="time"
                  display="spinner"
                  onValueChange={onChangeStartTime}
                  onDismiss={onCloseActiveSheet}
                />
              )
            ) : (
              <Sheet
                modal
                open={isShowStartTime}
                onOpenChange={(open: boolean) => !open && onCloseActiveSheet()}
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
                    <Stack justify="center" items="center" onPress={onCloseActiveSheet}>
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
                    onValueChange={onChangeStartTime}
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
                onOpenChange={(open: boolean) => !open && onCloseActiveSheet()}
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
                      <Stack justify="center" items="center" onPress={onCloseActiveSheet}>
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
          {/* <Stack
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
          </Stack> */}
          {/* Midnight Notification will be updated after back-notification feature is implemented */}
        </Stack>
      </BlurBox>
    );
  },
);

const YoasobiWeekCompleteBox = memo(() => (
  <BlurBox>
    <Stack width="$fluid" justify="center" items="center" gap="$size.x6" py="$size.x4">
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
      <Stack justify="center" items="center" gap="$size.x2">
        <Text style={{ textAlign: 'center' }} fontSize="$8" fontWeight="$900" color="$colors.moonSoftWhite">
          이번 주 YOASOBI를 마쳤어요
        </Text>
        <Text style={{ textAlign: 'center' }} fontSize="$5" color="$colors.cloudGray">
          다음 주에 새로운 새벽 산책을 정해보세요.
        </Text>
      </Stack>
    </Stack>
  </BlurBox>
));

const YoasobiResultBox = memo<IYoasobiResultBoxProps>(({ yoasobiDate, createdDate }) => {
  const { deviceLocalDate, deviceTimeZone } = useDateTime();
  const deviceLocalYoasobiDateTime = getUtcToLocalUtil({ utcDate: yoasobiDate, timeZone: deviceTimeZone });
  const yoasobiTimeText = deviceLocalYoasobiDateTime.slice(11, 16);

  const today = new Date(deviceLocalDate.slice(0, 10));
  const deviceLocalYoasobiDay = new Date(deviceLocalYoasobiDateTime.slice(0, 10));
  const yoasobiDay = DAY_OF_WEEK_ARRAY[deviceLocalYoasobiDay.getUTCDay()];
  const remainingDays = Math.max(0, (deviceLocalYoasobiDay.getTime() - today.getTime()) / MS_PER_DAY);
  const isDday = remainingDays <= 0;
  const ddayText = isDday ? 'D-DAY' : `D-${remainingDays}`;

  const nowDateTime = Date.now();
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
              {yoasobiTimeText} 알림
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
  const navbarHeight = useBottomTabBarHeight();

  const { userId, isReady } = useAuth();
  const { isDateTimeReady, deviceLocalDate, deviceTimeZone, weekStartDate, utcDate } = useDateTime();

  const weekStartDateString = isDateTimeReady ? weekStartDate?.toISOString() : undefined;
  const selectableDaysOfWeek = useMemo(() => {
    const today = new Date(deviceLocalDate.slice(0, 10));
    return DAY_OF_WEEK_ARRAY.slice(today.getUTCDay() + 1);
  }, [deviceLocalDate]);
  const initialSelectedDayOfWeek = selectableDaysOfWeek[0] ?? null;

  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<DayOfWeek | null>(initialSelectedDayOfWeek);
  const [startTime, setStartTime] = useState<Date>(utcDate);
  const [duration, setDuration] = useState<number>(MIN_YOASOBI_DURATION_MINUTES);

  const [currentYoasobi, setCurrentYoasobi] = useState<IYoasobi | null>(null);

  const [activeSheet, setActiveSheet] = useState<IYoasobiChoiceBoxSheetType>(null);
  const [isMidnightNotificationEnabled, setIsMidnightNotificationEnabled] = useState<boolean>(false);
  const [hasWeeklyYoasobiException, setHasWeeklyYoasobiException] = useState<boolean>(false);
  const [homeScreenAlert, setHomeScreenAlert] = useState<IHomeScreenAlert>(null);
  const [isCreationResultUnknown, setIsCreationResultUnknown] = useState<boolean>(false);
  const [isWeeklyQuerySettled, setIsWeeklyQuerySettled] = useState<boolean>(false);

  const isCreationResultUnknownRef = useRef(false);
  const isCreateYoasobiLockedRef = useRef(false);
  const latestWeeklyRequestIdRef = useRef(0);

  const [
    getWeeklyYoasobiQuery,
    {
      called: isWeeklyYoasobiCalled,
      loading: isWeeklyYoasobiLoading,
      error: weeklyYoasobiError,
      data: weeklyYoasobiData,
    },
  ] = useGetWeeklyYoasobiLazyQuery({
    fetchPolicy: 'network-only',
    errorPolicy: 'none',
  });

  const [createYoasobiMutation, { loading: isCreatingYoasobi }] = useCreateYoasobiMutation({ errorPolicy: 'none' });

  const newYoasobiDate = useMemo(() => {
    if (!selectedDayOfWeek) {
      return null;
    }
    try {
      const selectedDate = new Date(deviceLocalDate.slice(0, 10));
      const selectedUTCDate =
        selectedDate.getUTCDate() - selectedDate.getUTCDay() + DAY_OF_WEEK_ARRAY.indexOf(selectedDayOfWeek);
      selectedDate.setUTCDate(selectedUTCDate);
      const date = selectedDate.toISOString().slice(0, 10);
      const hours = String(startTime.getHours()).padStart(2, '0');
      const minutes = String(startTime.getMinutes()).padStart(2, '0');
      const newYoasobiUTCDate = getLocalToUtcUtil({
        localDate: `${date}T${hours}:${minutes}`,
        timeZone: deviceTimeZone,
      }).toISOString();
      return newYoasobiUTCDate;
    } catch {
      return null;
    }
  }, [deviceLocalDate, deviceTimeZone, selectedDayOfWeek, startTime]);

  const weeklyQueryStatus =
    !isReady ||
    !userId ||
    !weekStartDateString ||
    !isWeeklyQuerySettled ||
    !isWeeklyYoasobiCalled ||
    isWeeklyYoasobiLoading
      ? 'loading'
      : weeklyYoasobiError || hasWeeklyYoasobiException || weeklyYoasobiData?.getYoasobi?.yoasobi === undefined
        ? 'error'
        : 'ready';

  const loadingCondition = weeklyQueryStatus === 'loading';
  const fetchingErrorCondition = weeklyQueryStatus === 'error';
  const contentCondition = weeklyQueryStatus === 'ready';
  const resultCondition = currentYoasobi !== null;
  const creationFormCondition = !resultCondition && selectedDayOfWeek !== null && selectableDaysOfWeek.length > 0;
  const weekCompleteCondition = !resultCondition && !creationFormCondition;
  const createAllowedCondition =
    weeklyQueryStatus === 'ready' &&
    newYoasobiDate !== null &&
    weeklyYoasobiData?.getYoasobi?.yoasobi === null &&
    currentYoasobi === null &&
    !isCreatingYoasobi &&
    !isCreationResultUnknown &&
    selectedDayOfWeek !== null &&
    selectableDaysOfWeek.includes(selectedDayOfWeek);

  const recordCheckDisabledCondition = loadingCondition || isCreatingYoasobi;
  const fetchingAlertCondition = homeScreenAlert === 'fetchingIssue' && fetchingErrorCondition;
  const creationAlertCondition = homeScreenAlert === 'creationIssue';

  const fetchWeeklyYoasobi = useCallback(async () => {
    if (!isReady || !userId || !weekStartDateString) {
      return;
    }
    latestWeeklyRequestIdRef.current += 1;
    const requestId = latestWeeklyRequestIdRef.current;
    setHomeScreenAlert(null);
    setHasWeeklyYoasobiException(false);
    try {
      const { data, error } = await getWeeklyYoasobiQuery({
        variables: {
          input: {
            weekStartDate: weekStartDateString,
          },
        },
      });
      if (requestId !== latestWeeklyRequestIdRef.current) {
        return;
      }
      const yoasobi = data?.getYoasobi?.yoasobi;
      const hasFetchingException = error || yoasobi === undefined;
      if (hasFetchingException) {
        throw new Error('Yoasobi fetching result is missing');
      }
      setCurrentYoasobi(
        yoasobi !== null
          ? {
              ...yoasobi,
              yoasobiDate: parseDateTime(yoasobi.yoasobiDate),
              alarmTime: parseDateTime(yoasobi.alarmTime),
              createdAt: parseDateTime(yoasobi.createdAt),
            }
          : null,
      );
      isCreationResultUnknownRef.current = false;
      setIsCreationResultUnknown(false);
    } catch {
      if (requestId !== latestWeeklyRequestIdRef.current) {
        return;
      }
      setHasWeeklyYoasobiException(true);
      setHomeScreenAlert('fetchingIssue');
    } finally {
      if (requestId === latestWeeklyRequestIdRef.current) {
        setIsWeeklyQuerySettled(true);
      }
    }
  }, [getWeeklyYoasobiQuery, isReady, userId, weekStartDateString]);

  const createNewYoasobi = useCallback(async () => {
    const shouldBlockYoasobiCreation =
      isCreateYoasobiLockedRef.current || isCreationResultUnknownRef.current || !userId || !createAllowedCondition;
    if (shouldBlockYoasobiCreation || !newYoasobiDate || !selectedDayOfWeek) {
      return;
    }
    isCreateYoasobiLockedRef.current = true;
    const requestId = latestWeeklyRequestIdRef.current;
    try {
      const { data, errors } = await createYoasobiMutation({
        variables: {
          input: {
            dayOfWeek: selectedDayOfWeek,
            yoasobiDate: newYoasobiDate,
            alarmTime: newYoasobiDate,
            duration,
          },
        },
        fetchPolicy: 'network-only',
      });
      const createdYoasobi = data?.createYoasobi?.yoasobi;
      if (errors?.length || !createdYoasobi) {
        throw new Error('Yoasobi creation result is missing');
      }
      if (requestId !== latestWeeklyRequestIdRef.current) {
        return;
      }
      setCurrentYoasobi({
        ...createdYoasobi,
        yoasobiDate: parseDateTime(createdYoasobi.yoasobiDate),
        alarmTime: parseDateTime(createdYoasobi.alarmTime),
        createdAt: parseDateTime(createdYoasobi.createdAt),
      });
    } catch {
      if (requestId !== latestWeeklyRequestIdRef.current) {
        return;
      }
      isCreationResultUnknownRef.current = true;
      setIsCreationResultUnknown(true);
      setHomeScreenAlert('creationIssue');
    } finally {
      isCreateYoasobiLockedRef.current = false;
    }
  }, [createAllowedCondition, createYoasobiMutation, duration, selectedDayOfWeek, userId, newYoasobiDate]);

  const handlePressDay = useCallback(
    (day: DayOfWeek) => {
      if (!selectableDaysOfWeek.includes(day)) {
        return;
      }
      setSelectedDayOfWeek(day);
    },
    [selectableDaysOfWeek],
  );

  const handleCheckMidnightNotification = useCallback((checked: boolean) => {
    setIsMidnightNotificationEnabled(checked);
  }, []);

  const handleShowStartTimeSheet = useCallback(() => {
    setActiveSheet('startTime');
  }, []);

  const handleShowDurationSheet = useCallback(() => {
    setActiveSheet('duration');
  }, []);

  const handleCloseActiveSheet = useCallback(() => {
    setActiveSheet(null);
  }, []);

  const handleChangeStartTime = useCallback((event: DateTimePickerChangeEvent, startTime: Date) => {
    if (Platform.OS === 'android') {
      setActiveSheet(null);
    }
    setStartTime(startTime);
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

  const handlePressCreateYoasobi = useCallback(async () => {
    await createNewYoasobi();
  }, [createNewYoasobi]);

  useLayoutEffect(() => {
    setIsWeeklyQuerySettled(false);
    return () => {
      latestWeeklyRequestIdRef.current += 1;
    };
  }, [isReady, userId, weekStartDateString]);

  useEffect(() => {
    if (isReady && userId) {
      fetchWeeklyYoasobi();
    }
  }, [userId, isReady, fetchWeeklyYoasobi]);

  useEffect(() => {
    if (selectedDayOfWeek && selectableDaysOfWeek.includes(selectedDayOfWeek)) {
      return;
    }
    setSelectedDayOfWeek(selectableDaysOfWeek[0] ?? null);
  }, [selectableDaysOfWeek, selectedDayOfWeek]);

  return (
    <DefaultLayout isBlur hasHeader>
      {loadingCondition && (
        <Stack flex={1} justify="center" items="center" gap="$size.x4" pb={navbarHeight}>
          <Spinner size="large" color="$colors.midnightPurple_Darker" />
          <Text fontSize="$6" fontWeight="$700" color="$colors.cloudGray" style={{ textAlign: 'center' }}>
            이번 주 기록을 확인하고 있어요.
          </Text>
        </Stack>
      )}
      {fetchingErrorCondition && (
        <Stack flex={1} justify="center" items="center" gap="$size.x3" pb={navbarHeight}>
          <Text color="$colors.cloudGray" style={{ textAlign: 'center' }}>
            이번 주 기록을 확인하지 못했어요.
          </Text>
          <Button disabled={isCreatingYoasobi} onPress={() => setHomeScreenAlert('fetchingIssue')}>
            다시 시도
          </Button>
        </Stack>
      )}
      {contentCondition && (
        <ScrollView flex={1} contentContainerStyle={{ pb: navbarHeight + 16 }}>
          <Stack flex={1} px="$size.x2" gap="$size.x4">
            <Stack pt="$size.x4" gap="$size.x1_5">
              <Text fontSize="$7" fontWeight="$500" color="$colors.cloudGray">
                이번주 YOASOBI 를 정해요!
              </Text>
              <Text fontSize="$9" fontWeight="$700" color="$colors.moonSoftWhite">
                새벽 산책 해볼까요?
              </Text>
            </Stack>
            {resultCondition && (
              <YoasobiResultBox yoasobiDate={currentYoasobi.yoasobiDate} createdDate={currentYoasobi.createdAt} />
            )}
            {creationFormCondition && (
              <Stack flex={1} width="$fluid" gap="$size.x4">
                <YoasobiChoiceBox
                  selectedDayOfWeek={selectedDayOfWeek}
                  selectableDaysOfWeek={selectableDaysOfWeek}
                  isMidnightNotificationEnabled={isMidnightNotificationEnabled}
                  activeSheet={activeSheet}
                  startTimeValue={startTime}
                  userTimeZone={deviceTimeZone}
                  durationValue={duration}
                  onChangeStartTime={(event, date) => handleChangeStartTime(event, date)}
                  onIncreaseDuration={handleIncreaseDuration}
                  onDecreaseDuration={handleDecreaseDuration}
                  onPressShowStartTime={handleShowStartTimeSheet}
                  onPressShowDuration={handleShowDurationSheet}
                  onCloseActiveSheet={handleCloseActiveSheet}
                  onPressDay={handlePressDay}
                  onPressRandomDay={handlePressRandomDay}
                  onCheckMidnightNotification={handleCheckMidnightNotification}
                />
                {!newYoasobiDate && (
                  <Text color="$colors.cloudGray">현재 지역에서 사용할 수 있는 시작 시간을 선택해 주세요.</Text>
                )}
                {isCreationResultUnknown ? (
                  <BlurBox px="$size.x4">
                    <Stack width="$fluid" flexDirection="row" justify="space-between" items="center">
                      <Stack gap="$size.x0_5">
                        <Text fontSize="$4" fontWeight="$700" color="$colors.moonSoftWhite">
                          생성 여부를 확인하지 못했어요.
                        </Text>
                        <Text fontSize="$3" fontWeight="$500" color="$colors.cloudGray">
                          이번 주 기록을 확인해 주세요.
                        </Text>
                      </Stack>
                      <Button
                        height="auto"
                        px="$size.x2"
                        py="$size.x2"
                        bg="$colors.midnightPurple"
                        borderColor="$colors.cloudGray"
                        borderTopLeftRadius="$size.x2"
                        borderTopRightRadius="$size.x2"
                        borderBottomLeftRadius="$size.x2"
                        borderBottomRightRadius="$size.x2"
                        pressStyle={{
                          bg: '$colors.midnightPurple',
                          opacity: 0.8,
                          scale: 0.98,
                        }}
                        onPress={() => setHomeScreenAlert('creationIssue')}>
                        <Text fontWeight="$700" color="$colors.lampYellow">
                          기록 확인
                        </Text>
                      </Button>
                    </Stack>
                  </BlurBox>
                ) : (
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
                    disabled={!createAllowedCondition}
                    onPress={handlePressCreateYoasobi}>
                    <Text fontSize="$8" fontWeight="$800" color="$colors.midnightPurple">
                      생성하기
                    </Text>
                  </Button>
                )}
              </Stack>
            )}
            {weekCompleteCondition && <YoasobiWeekCompleteBox />}
          </Stack>
        </ScrollView>
      )}
      <Alert
        isOpen={fetchingAlertCondition}
        onClose={() => setHomeScreenAlert(null)}
        alertPadding="$size.x4"
        contentBorderRadius={12}
        isErrorAlert>
        <Stack width="$fluid" gap="$size.x6">
          <Stack width="$fluid" gap="$size.x2">
            <AlertDialog.Title fontSize="$8" fontWeight="$700" color="$colors.moonSoftWhite">
              기록을 확인하지 못했어요
            </AlertDialog.Title>
            <AlertDialog.Description color="$colors.cloudGray">
              잠시 후 다시 시도해 주세요. 조회가 완료되면 이번 주 기록을 확인할 수 있어요.
            </AlertDialog.Description>
          </Stack>
          <Stack width="$fluid" flexDirection="row" gap="$size.x2">
            <Button
              flex={1}
              height="$size.x10"
              bg="$colors.lampYellow"
              disabled={recordCheckDisabledCondition}
              pressStyle={{
                bg: '$colors.lampYellow',
                opacity: 0.8,
              }}
              onPress={() => fetchWeeklyYoasobi()}>
              <Text fontWeight="$700" color="$colors.midnightPurple">
                다시 시도
              </Text>
            </Button>
            <Button flex={1} height="$size.x10" onPress={() => setHomeScreenAlert(null)}>
              <Text fontWeight="$700" color="$colors.lampYellow">
                닫기
              </Text>
            </Button>
          </Stack>
        </Stack>
      </Alert>
      <Alert
        isOpen={creationAlertCondition}
        onClose={() => setHomeScreenAlert(null)}
        alertPadding="$size.x4"
        contentBorderRadius={12}
        isErrorAlert>
        <Stack width="$fluid" gap="$size.x4">
          <AlertDialog.Title fontSize="$8" fontWeight="$700" color="$colors.moonSoftWhite">
            생성 결과를 확인하지 못했어요
          </AlertDialog.Title>
          <AlertDialog.Description color="$colors.cloudGray">
            기록이 이미 생성됐을 수 있어요. 다시 생성하기 전에 이번 주 기록을 확인해 주세요. 선택한 설정은 유지돼요.
          </AlertDialog.Description>
          <Stack width="$fluid" flexDirection="row" gap="$size.x2">
            <Button
              flex={1}
              height="$size.x10"
              bg="$colors.lampYellow"
              disabled={recordCheckDisabledCondition}
              pressStyle={{
                bg: '$colors.lampYellow',
                opacity: 0.8,
              }}
              onPress={() => fetchWeeklyYoasobi()}>
              <Text fontWeight="$700" color="$colors.midnightPurple">
                기록 확인
              </Text>
            </Button>
            <Button flex={1} height="$size.x10" onPress={() => setHomeScreenAlert(null)}>
              <Text fontWeight="$700" color="$colors.lampYellow">
                닫기
              </Text>
            </Button>
          </Stack>
        </Stack>
      </Alert>
    </DefaultLayout>
  );
});
