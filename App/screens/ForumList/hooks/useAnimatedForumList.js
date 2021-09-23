import {useLayoutEffect, useRef} from 'react';
import {Animated} from 'react-native';

export const useAnimatedForumList = ({
  scrollY,
  index,
  ITEM_HEIGHT,
  WINDOW_LIST_HEIGHT,
  width,
}) => {
  const value = useRef(new Animated.Value(0)).current;

  const position = Animated.subtract(ITEM_HEIGHT * index, scrollY);

  const isDisappearing = -ITEM_HEIGHT;
  const isTop = 0;
  const isBottom = WINDOW_LIST_HEIGHT - ITEM_HEIGHT;
  const isAppearing = WINDOW_LIST_HEIGHT;

  const translateY = Animated.add(
    Animated.add(
      scrollY,
      scrollY.interpolate({
        inputRange: [0, 0.000001 + ITEM_HEIGHT * index],
        outputRange: [0, -ITEM_HEIGHT * index],
        extrapolate: 'clamp',
      }),
    ),

    position.interpolate({
      inputRange: [isBottom, isAppearing],
      outputRange: [0, -ITEM_HEIGHT],
      extrapolate: 'clamp',
    }),
  );

  useLayoutEffect(() => {
    Animated.timing(value, {
      toValue: 100,
      delay: index * 200,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateX = value.interpolate({
    inputRange: [0, 50],
    outputRange: [-width, 0],
    extrapolate: 'clamp',
  });

  const imageScale = value.interpolate({
    inputRange: [50, 100],
    outputRange: [0, 1],
  });

  const scale = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });

  const opacity = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0, 1, 1, 0],
  });

  const rotateX = position.interpolate({
    inputRange: [isDisappearing * 0.6, isTop],
    outputRange: ['90deg', '0deg'],
    extrapolate: 'clamp',
  });

  return {
    translateY,
    translateX,
    scale,
    imageScale,
    opacity,
    rotateX,
  };
};
