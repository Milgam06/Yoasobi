import { memo, useCallback, useState } from 'react';
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Stack, ScrollView, Image } from 'tamagui';

type IHistoryDetailImageSliderProps = { images: string[] };

export const HistoryDetailImageSlider = memo<IHistoryDetailImageSliderProps>(({ images }) => {
  const [width, setWidth] = useState<number>(0);
  const [sliderIndex, setSliderIndex] = useState<number>(0);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const deviceWidth = event.nativeEvent.layout.width;
      if (width !== deviceWidth) {
        setWidth(deviceWidth);
        setSliderIndex(0);
      }
    },
    [width],
  );

  const handleSwipeImage = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const page = Math.round(event.nativeEvent.contentOffset.x / width);
      setSliderIndex(Math.min(images.length - 1, Math.max(0, page)));
    },
    [images.length, width],
  );

  if (images.length === 0) {
    return;
  }

  return (
    <Stack gap="$size.x2" onLayout={handleLayout}>
      {width > 0 && (
        <ScrollView
          key={width}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={32}
          onScroll={handleSwipeImage}>
          {images.map((uri, i) => (
            <Stack key={i} width={width} items="center" justify="center">
              <Image source={{ uri }} style={{ width: width - 12, aspectRatio: 16 / 9, borderRadius: 12 }} />
            </Stack>
          ))}
        </ScrollView>
      )}
      {images.length > 1 && (
        <Stack flexDirection="row" justify="center" gap="$size.x1">
          {images.map((_, i) => (
            <Stack
              key={i}
              height="$size.x1_5"
              width={i === sliderIndex ? '$size.x4' : '$size.x1_5'}
              style={{ borderRadius: 3 }}
              bg={i === sliderIndex ? '$colors.lampYellow' : '$colors.cloudGray'}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
});
