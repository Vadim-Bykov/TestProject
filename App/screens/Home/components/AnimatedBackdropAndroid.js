import React from 'react';
import {StyleSheet, Animated, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BASE_IMAGE_URL, DEFAULT_MOVIE_IMAGE} from '../../../consts/consts';
import * as utils from '../../../utils/utils';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '@react-navigation/native';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export const AnimatedBackdropAndroid = ({mediaData, scrollX}) => {
  const {width, ITEM_WIDTH} = utils.getHomePagerDimensions();
  const {colors} = useTheme();

  return (
    <>
      {mediaData?.map((item, index) => {
        const translateX = scrollX.interpolate({
          inputRange: [0, 0.000001 + ITEM_WIDTH * index],
          outputRange: [width * index, 0],
          extrapolate: 'clamp',
        });

        return (
          <AnimatedFastImage
            key={`poster${item.id}`}
            source={{
              uri: item.backdrop_path
                ? `${BASE_IMAGE_URL}w1280${item.backdrop_path}`
                : DEFAULT_MOVIE_IMAGE,
            }}
            style={[styles.image, {transform: [{translateX}]}]}
          />
        );
      })}

      {/* <View style={[styles.container, styles.image]} /> */}
      <LinearGradient
        colors={['transparent', colors.background]}
        style={styles.image}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  image: {
    ...StyleSheet.absoluteFill,
    position: 'absolute',
  },
});
