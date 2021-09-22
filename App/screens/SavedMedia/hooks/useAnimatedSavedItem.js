import React, {useMemo} from 'react';
import {Platform, Animated} from 'react-native';

export const useAnimatedSavedItem = ({
  index,
  itemWidth,
  scrollX,
  horizontalSpace,
}) => {
  const inputRange = [
    (index - 1) * itemWidth,
    index * itemWidth,
    (index + 1) * itemWidth,
  ];

  const partValue = useMemo(() => Platform.select({ios: 20, android: 50}), []);

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [partValue, -40, partValue],
  });

  const translateX = Animated.add(
    scrollX,
    scrollX.interpolate({
      inputRange: [0, 0.00001 + itemWidth * index],
      outputRange: [
        index * horizontalSpace * 2,
        index === 0 ? 0 : -(itemWidth * index + horizontalSpace),
      ],
      extrapolateRight: 'clamp',
    }),
  );

  return {translateY, translateX};
};
