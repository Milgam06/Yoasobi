import { BlurBox, DefaultLayout } from '@/components';
import { DAY_OF_WEEK_ARRAY, DAY_OF_WEEK_TEXT } from '@/constants';
import { DayOfWeek, useGetWeeklyYoasobiLazyQuery } from '@/libs';
import { getWeekStartDateUtil } from '@/utils';
import { faAlarmClock } from '@fortawesome/free-solid-svg-icons/faAlarmClock';
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons/faStopwatch';
import { faBurst } from '@fortawesome/free-solid-svg-icons/faBurst';
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { memo, useCallback, useMemo, useState } from 'react';
import { useDidMount } from 'rooks';
import { Button, ColorTokens, Progress, ScrollView, Separator, Sheet, Stack, Switch, Text } from 'tamagui';

type IYoasobi = {
  id: string;
  yoasobiDate: Date;
  dayOfWeek: DayOfWeek;
  alarmTime: Date;
  duration: number;
  createdAt: Date;
};

type IYoasobiChoiceBoxProps = {
  selectedDay: DayOfWeek;
  isMidnightNotificationEnabled: boolean;
  isShowStartTime: boolean;
  isShowDuration: boolean;
  onPressShowStartTime: () => void;
  onPressShowDuration: () => void;
  onCloseStartTime: () => void;
  onCloseDuration: () => void;
  onPressDay: (day: DayOfWeek) => void;
  onPressRandomDay: () => void;
  onCheckMidnightNotification: (checked: boolean) => void;
};

type IYoasobiResultBoxProps = {
  yoasobiDay: DayOfWeek;
  yoasobiDate: Date;
  createdDate: Date;
};

const YoasobiChoiceBox = memo<IYoasobiChoiceBoxProps>(
  ({
    selectedDay,
    isMidnightNotificationEnabled,
    isShowStartTime,
    isShowDuration,
    onPressShowStartTime,
    onPressShowDuration,
    onCloseStartTime,
    onCloseDuration,
    onPressDay,
    onPressRandomDay,
    onCheckMidnightNotification,
  }) => {
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
                const isDayActive = day === selectedDay;
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
                    animation="quick"
                    style={{ borderRadius: 8 }}
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
                00:00
              </Text>
            </Stack>
            {isShowStartTime && (
              <Sheet
                modal
                open={isShowStartTime}
                onOpenChange={(open: boolean) => !open && onCloseStartTime()}
                snapPoints={[32]}
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
                  <Text>asdf</Text>
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
                00 분
              </Text>
            </Stack>
            {isShowDuration && (
              <Sheet
                modal
                open={isShowDuration}
                onOpenChange={(open: boolean) => !open && onCloseDuration()}
                snapPoints={[32]}
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
                  <Text>123</Text>
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

          <Button
            width="$fluid"
            height="auto"
            py="$size.x1_5"
            bg="$colors.lampYellow"
            borderTopLeftRadius="$size.x5"
            borderTopRightRadius="$size.x5"
            borderBottomLeftRadius="$size.x5"
            borderBottomRightRadius="$size.x5"
            pressStyle={{
              bg: '$colors.lampYellow',
              opacity: 0.8,
              scale: 0.98,
            }}>
            <Text fontSize="$8" fontWeight="$700" color="$colors.midnightPurple">
              생성하기
            </Text>
          </Button>
        </Stack>
      </BlurBox>
    );
  },
);
YoasobiChoiceBox.displayName = 'YoasobiChoiceBox';

const YoasobiResultBox = memo<IYoasobiResultBoxProps>(({ yoasobiDay, yoasobiDate, createdDate }) => {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
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
YoasobiResultBox.displayName = 'YoasobiResultBox';

export const HomeScreen = memo(() => {
  const [isMidnightNotificationEnabled, setIsMidnightNotificationEnabled] = useState<boolean>(false);
  const [yoasobi, setYoasobi] = useState<IYoasobi | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DayOfWeek.Sunday);
  const [startTime, setStartTime] = useState<Date>();
  const [isStartTimeSheetOpen, setIsStartTimeSheetOpen] = useState<boolean>(false);
  const [isDurationSheetOpen, setIsDurationSheetOpen] = useState<boolean>(false);
  const [getWeeklyYoasobiQuery] = useGetWeeklyYoasobiLazyQuery();

  const { weekStartDate } = useMemo(() => {
    const currentDate = new Date();
    const { weekStartDate } = getWeekStartDateUtil({ currentDate });
    return { weekStartDate };
  }, []);

  const handlePressDay = useCallback((day: DayOfWeek) => {
    setSelectedDay(day);
  }, []);

  const handleCheckMidnightNotification = useCallback((checked: boolean) => {
    setIsMidnightNotificationEnabled(checked);
  }, []);

  const handleShowStartTimeSheet = useCallback(() => {
    console.log('Show Start Time Sheet');
    setIsStartTimeSheetOpen(true);
  }, []);

  const handleShowDurationSheet = useCallback(() => {
    console.log('Show Duration Sheet');
    setIsDurationSheetOpen(true);
  }, []);

  const handleCloseStartTimeSheet = useCallback(() => {
    console.log('Close Start Time Sheet');
    setIsStartTimeSheetOpen(false);
  }, []);

  const handleCloseDurationSheet = useCallback(() => {
    console.log('Close Duration Sheet');
    setIsDurationSheetOpen(false);
  }, []);

  const handlePressRandomDay = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * DAY_OF_WEEK_ARRAY.length);
    console.log(DAY_OF_WEEK_ARRAY[randomIndex], 'asdf');
    const selectedRandomDay = DAY_OF_WEEK_ARRAY[randomIndex];
    setSelectedDay(selectedRandomDay);
  }, []);

  const fetchWeeklyYoasobi = useCallback(async () => {
    const { data } = await getWeeklyYoasobiQuery({
      variables: {
        input: {
          userId: 'currentUserId',
          weekStartDate,
        },
      },
    });
    const yoasobi = data?.getYoasobi.yoasobi;
    if (!yoasobi) {
      return;
    }
    setYoasobi(yoasobi);
  }, [getWeeklyYoasobiQuery, weekStartDate]);

  useDidMount(async () => {
    await fetchWeeklyYoasobi();
  });

  return (
    <DefaultLayout isBlur hasHeader>
      <ScrollView>
        <Stack flex={1} gap="$size.x4">
          <Stack pt="$size.x4" gap="$size.x1_5">
            <Text fontSize="$7" fontWeight="$500" color="$colors.cloudGray">
              이번주 YOASOBI 를 정해요!
            </Text>
            <Text fontSize="$9" fontWeight="$700" color="$colors.moonSoftWhite">
              새벽 산책 해볼까요?
            </Text>
          </Stack>
          {yoasobi ? (
            <YoasobiResultBox
              yoasobiDay={yoasobi.dayOfWeek}
              yoasobiDate={yoasobi.yoasobiDate}
              createdDate={yoasobi.createdAt}
            />
          ) : (
            <YoasobiChoiceBox
              selectedDay={selectedDay}
              isMidnightNotificationEnabled={isMidnightNotificationEnabled}
              isShowStartTime={isStartTimeSheetOpen}
              isShowDuration={isDurationSheetOpen}
              onPressShowStartTime={handleShowStartTimeSheet}
              onPressShowDuration={handleShowDurationSheet}
              onCloseStartTime={handleCloseStartTimeSheet}
              onCloseDuration={handleCloseDurationSheet}
              onPressDay={handlePressDay}
              onPressRandomDay={handlePressRandomDay}
              onCheckMidnightNotification={handleCheckMidnightNotification}
            />
          )}
        </Stack>
      </ScrollView>
    </DefaultLayout>
  );
});

HomeScreen.displayName = 'HomeScreen';
