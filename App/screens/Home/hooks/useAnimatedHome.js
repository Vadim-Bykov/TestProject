import {Animated} from 'react-native';

export const useAnimatedHome = ({
  index,
  ITEM_WIDTH,
  FLAT_LIST_WINDOW_WIDTH,
  scrollX,
}) => {
  const position = Animated.subtract(index * ITEM_WIDTH, scrollX);

  const isAppearing = FLAT_LIST_WINDOW_WIDTH;
  const isRight = FLAT_LIST_WINDOW_WIDTH - ITEM_WIDTH;
  const isLeft = 0;
  const isDisappearing = -ITEM_WIDTH;

  //  const translateX = Animated.add(
  //    Animated.add(
  //      Animated.add(
  //        scrollX,
  //        scrollX.interpolate({
  //          inputRange: [0, 0.000001 + ITEM_WIDTH * index],
  //          outputRange: [0, -ITEM_WIDTH * index],
  //          extrapolateRight: 'clamp',
  //        }),
  //      ),

  //      position.interpolate({
  //        inputRange: [isRight, isAppearing],
  //        outputRange: [0, -ITEM_WIDTH / 2],
  //        extrapolate: 'clamp',
  //      }),
  //    ),

  //    position.interpolate({
  //      inputRange: [isDisappearing, isLeft],
  //      outputRange: [-ITEM_WIDTH / 2, 0],
  //      extrapolate: 'clamp',
  //    }),
  //  );

  const translateX = Animated.add(
    Animated.add(
      scrollX,
      scrollX.interpolate({
        inputRange: [0, 0.000001 + ITEM_WIDTH * index],
        outputRange: [0, -ITEM_WIDTH * index],
        extrapolateRight: 'clamp',
      }),
    ),

    position.interpolate({
      inputRange: [isRight, isAppearing],
      outputRange: [0, -ITEM_WIDTH],
      extrapolate: 'clamp',
    }),
  );

  const scale = position.interpolate({
    // inputRange: [-ITEM_WIDTH, 0, ITEM_WIDTH],
    inputRange: [isDisappearing, isLeft, isRight, isAppearing],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });

  const opacity = position.interpolate({
    inputRange: [isDisappearing, isLeft, isRight, isAppearing],
    outputRange: [0.5, 1, 1, 0.5],
  });

  return {
    translateX,
    scale,
    opacity,
  };
};
