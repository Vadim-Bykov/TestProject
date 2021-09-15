import React from 'react';
import {StyleSheet, Animated} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {BASE_IMAGE_URL, DEFAULT_MOVIE_IMAGE} from '../../../consts/consts';
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export const AnimatedBackground = ({
  backdropPath,
  translateX,
  width,
  height,
  backgroundColor,
}) => {
  return (
    <AnimatedFastImage
      source={{
        uri: backdropPath
          ? `${BASE_IMAGE_URL}w1280${backdropPath}`
          : DEFAULT_MOVIE_IMAGE,
      }}
      resizeMode="cover"
      style={{
        width,
        height,
        position: 'absolute',
        transform: [{translateX}],
      }}>
      <LinearGradient
        colors={['transparent', backgroundColor]}
        style={styles.linearGradient}
      />
    </AnimatedFastImage>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    position: 'absolute',
    ...StyleSheet.absoluteFill,
  },
});
