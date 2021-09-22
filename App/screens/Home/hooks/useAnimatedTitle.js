import {TITLE_HEIGHT} from '../components/OverflowHomeTitle';

export const useAnimatedTitle = ({scrollX, ITEM_WIDTH, index}) => {
  const translateY = scrollX.interpolate({
    inputRange: [0, ITEM_WIDTH],
    outputRange: [0, -TITLE_HEIGHT],
  });

  const scale = scrollX.interpolate({
    inputRange: [
      ITEM_WIDTH * (index - 1),
      ITEM_WIDTH * index,
      ITEM_WIDTH * (index + 1),
    ],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const rotateX = scrollX.interpolate({
    inputRange: [ITEM_WIDTH * index, ITEM_WIDTH * (index + 1)],
    outputRange: ['0deg', '180deg'],
    extrapolate: 'clamp',
  });
  return {
    translateY,
    scale,
    rotateX,
  };
};
