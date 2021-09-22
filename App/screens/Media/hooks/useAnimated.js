import React from 'react';
import {View, Text} from 'react-native';

export const useAnimated = ({scroll, index, width, itemWidth}) => {
  const inputRange = [
    -itemWidth,
    0,
    itemWidth * (index === 0 ? index : index - 1),
    itemWidth * index,
    itemWidth * (index + 1),
  ];

  const scale = scroll.interpolate({
    inputRange,
    outputRange: [0.8, index === 1 ? 0.8 : 1, 0.8, 1, 0.8],
    extrapolate: 'clamp',
  });

  const translateX = scroll.interpolate({
    inputRange,
    outputRange: [
      -width * 0.08,
      index === 1 ? -width * 0.08 : 0,
      -width * 0.08,
      1,
      width * 0.08,
    ],
    extrapolate: 'clamp',
  });

  const opacity = scroll.interpolate({
    inputRange,
    outputRange: [-0.5, index === 1 ? -0.5 : 1, -0.5, 1, -0.5],
    extrapolate: 'clamp',
  });

  const shadowOpacity = scroll.interpolate({
    inputRange,
    outputRange: [-0.2, index === 1 ? -0.2 : 0.4, -0.2, 0.4, -0.2],
    extrapolate: 'clamp',
  });

  const elevation = scroll.interpolate({
    inputRange,
    outputRange: [-5, index === 1 ? -5 : 10, -5, 10, -5],
    extrapolate: 'clamp',
  });

  return {
    scale,
    translateX,
    opacity,
    shadowOpacity,
    elevation,
  };
};
