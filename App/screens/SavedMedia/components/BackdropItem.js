import MaskedView from '@react-native-community/masked-view';
import React, {useCallback} from 'react';
import {StyleSheet, Text, View, Animated, FlatList, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Rect} from 'react-native-svg';
import {
  BASE_IMAGE_URL,
  COLORS,
  DEFAULT_MOVIE_IMAGE,
} from '../../../consts/consts';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
// const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export const BackdropItem = ({
  item,
  index,
  width,
  height,
  scrollX,
  itemWidth,
}) => {
  const inputRange = [
    (index - 1) * itemWidth,
    index * itemWidth,
    //  (index + 1) * itemWidth,
  ];

  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: [-width, 0],
  });

  // const translateX = scrollX.interpolate({
  //   inputRange: [0, 0.00001 + index * itemWidth],
  //   outputRange: [0, -index * width],
  //   extrapolateRight: 'clamp',
  // });

  return (
    <MaskedView
      style={styles.maskedView}
      maskElement={
        <AnimatedSvg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{transform: [{translateX}]}}>
          <Rect x="0" y="0" width={width} height={height} fill="red" />
        </AnimatedSvg>
      }>
      <FastImage
        source={{
          uri: item.backdrop_path
            ? `${BASE_IMAGE_URL}w1280${item.backdrop_path}`
            : DEFAULT_MOVIE_IMAGE,
        }}
        style={{width, height: height * 0.8}}
      />

      <LinearGradient
        colors={['transparent', COLORS.BG_GENERAL]}
        style={[
          styles.linearGradient,
          {width, height: height * 0.8, bottom: 0},
        ]}
      />
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  maskedView: {
    position: 'absolute',
  },

  linearGradient: {
    position: 'absolute',
  },
});
