import { BlurBox, DefaultLayout } from '@/components';
import { faAlarmClock } from '@fortawesome/free-solid-svg-icons/faAlarmClock';
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell';
import { faBurst } from '@fortawesome/free-solid-svg-icons/faBurst';
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { memo, useCallback, useState } from 'react';
import { Button, ColorTokens, Progress, Stack, Switch, Text } from 'tamagui';

enum DayOfWeek {
  MONDAY = '월',
  TUESDAY = '화',
  WEDNESDAY = '수',
  THURSDAY = '목',
  FRIDAY = '금',
  SATURDAY = '토',
  SUNDAY = '일',
}

type IYoasobiResultBoxProps = {
  yoasobiDay: DayOfWeek;
  yoasobiTime: Date;
  choiceDate: Date;
};

export const HomeScreen = memo(() => {
  const [isMidnightNotificationEnabled, setIsMidnightNotificationEnabled] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DayOfWeek.SUNDAY);

  const handlePressDay = useCallback((day: DayOfWeek) => {
    setSelectedDay(day);
  }, []);

  const handlePressRandomDay = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * Object.values(DayOfWeek).length);
    const selectedRandomDay = Object.values(DayOfWeek)[randomIndex];
    setSelectedDay(selectedRandomDay);
  }, []);

  const handleCheckMidnightNotification = useCallback((checked: boolean) => {
    setIsMidnightNotificationEnabled(checked);
  }, []);

  const YoasobiChoiceBox = memo(() => {
    return (
      <BlurBox>
        <Stack width="$fluid" justify="center" items="center" gap="$size.x7">
          <Stack width="$fluid" justify="center" gap="$size.x1">
            <Text fontSize="$5" color="$colors.cloudGray">
              Weekly Pick
            </Text>
            <Text fontSize="$7" fontWeight="$900" color="$colors.moonSoftWhite">
              요일을 뽑거나, 직접 골라보세요!
            </Text>
          </Stack>
          <Stack width="$fluid" justify="center" gap="$size.x3">
            <Stack width="$fluid" flexDirection="row" justify="space-between" items="center" pt="$size.x2">
              {Object.values(DayOfWeek).map((day) => {
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
                    onPress={() => handlePressDay(day)}>
                    <Text fontSize="$7" fontWeight="$900" color={fontColor}>
                      {day}
                    </Text>
                  </Stack>
                );
              })}
            </Stack>
            <Stack width="$fluid" flexDirection="row" justify="space-between" items="center" gap="$size.x2">
              <Stack
                flex={1}
                flexDirection="row"
                justify="center"
                items="center"
                py="$size.x2"
                bg="$colors.moonSoftWhite"
                gap="$size.x1_5"
                borderWidth={1}
                borderColor="$colors.cloudGray"
                style={{ borderRadius: 16 }}
                pressStyle={{ opacity: 0.6 }}
                onPress={handlePressRandomDay}>
                <FontAwesomeIcon size={20} icon={faBurst} color="#313252" />
                <Text fontSize="$7" fontWeight="$800" color="$colors.midnightPurple">
                  랜덤 뽑기
                </Text>
              </Stack>
              <Stack
                flex={1}
                flexDirection="row"
                justify="center"
                items="center"
                py="$size.x2"
                gap="$size.x1_5"
                bg="$colors.midnightPurple"
                borderWidth={1}
                borderColor="$colors.cloudGray"
                style={{ borderRadius: 16 }}
                pressStyle={{ opacity: 0.6 }}>
                <Text fontSize="$7" fontWeight="$800" color="$colors.moonSoftWhite">
                  직접 선택
                </Text>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            width="$fluid"
            flexDirection="row"
            justify="space-between"
            items="center"
            px="$size.x6"
            py="$size.x5"
            borderWidth={1}
            boxShadow={isMidnightNotificationEnabled ? '0 0 16px #fed89660' : 'none'}
            borderColor={isMidnightNotificationEnabled ? '$colors.lampYellow' : '$colors.cloudGray'}
            animation="quickest"
            style={{ borderRadius: 8 }}>
            <Stack flexDirection="row" justify="center" items="center" gap="$size.x3">
              <FontAwesomeIcon size={32} icon={faBell} color={isMidnightNotificationEnabled ? '#FED896' : '#858090'} />
              <Text
                fontSize="$8"
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
              onCheckedChange={(checked) => handleCheckMidnightNotification(checked)}>
              <Switch.Thumb animation="quick" bg="$colors.moonSoftWhite" />
            </Switch>
          </Stack>
          <Button
            width="$fluid"
            height="auto"
            py="$size.x2"
            bg="$colors.midnightPurple"
            borderWidth={1}
            borderColor="$colors.moonSoftWhite"
            pressStyle={{
              opacity: 0.8,
            }}>
            <Text fontSize="$8" fontWeight="$600" color="$colors.moonSoftWhite">
              YOASOBI
            </Text>
          </Button>
        </Stack>
      </BlurBox>
    );
  });
  YoasobiChoiceBox.displayName = 'YoasobiChoiceBox';

  const YoasobiResultBox = memo<IYoasobiResultBoxProps>(({ yoasobiDay, yoasobiTime, choiceDate }) => {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const yoasobiTimeText = `${yoasobiTime.getHours()}:${yoasobiTime.getMinutes().toString().padStart(2, '0')}`;

    const now = new Date();
    const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yoasobiStart = new Date(yoasobiTime.getFullYear(), yoasobiTime.getMonth(), yoasobiTime.getDate()).getTime();
    const remainingDays = Math.max(0, Math.ceil((yoasobiStart - nowStart) / MS_PER_DAY));
    const isDday = remainingDays <= 0;
    const ddayText = isDday ? 'D-DAY' : `D-${remainingDays}`;

    const nowDateTime = now.getTime();
    const yoasobiDateTime = yoasobiTime.getTime();
    const choiceDateTime = choiceDate.getTime();
    const totalDuration = yoasobiDateTime - choiceDateTime;
    const elapsedTime = Math.max(0, Math.min(totalDuration, nowDateTime - choiceDateTime));
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
                {yoasobiDay}요일
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
  YoasobiResultBox.displayName = 'YoasobiResultBox';

  return (
    <DefaultLayout isBlur hasHeader>
      <Stack flex={1} gap="$size.x4">
        <Stack pt="$size.x4" gap="$size.x1_5">
          <Text fontSize="$7" fontWeight="$500" color="$colors.cloudGray">
            이번주 YOASOBI 를 정해요!
          </Text>
          <Text fontSize="$9" fontWeight="$700" color="$colors.moonSoftWhite">
            새벽 산책 해볼까요?
          </Text>
        </Stack>
        <YoasobiResultBox
          yoasobiDay={DayOfWeek.FRIDAY}
          yoasobiTime={new Date('2026-01-30')}
          choiceDate={new Date('2026-01-22')}
        />
      </Stack>
    </DefaultLayout>
  );
});

HomeScreen.displayName = 'HomeScreen';
