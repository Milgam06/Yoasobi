import { BlurBox, DefaultLayout } from '@/components';
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell';
import { faBurst } from '@fortawesome/free-solid-svg-icons/faBurst';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { memo, useCallback, useState } from 'react';
import { ColorTokens, Stack, Switch, Text } from 'tamagui';

enum DayOfWeek {
  MONDAY = '월',
  TUESDAY = '화',
  WEDNESDAY = '수',
  THURSDAY = '목',
  FRIDAY = '금',
  SATURDAY = '토',
  SUNDAY = '일',
}

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
                <FontAwesomeIcon
                  size={32}
                  icon={faBell}
                  color={isMidnightNotificationEnabled ? '#FED896' : '#858090'}
                />
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
          </Stack>
        </BlurBox>
      </Stack>
    </DefaultLayout>
  );
});

HomeScreen.displayName = 'HomeScreen';
