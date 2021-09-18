import React, {useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BASE_IMAGE_URL, DEFAULT_MOVIE_IMAGE} from '../../../consts/consts';
import {useAnimatedHome} from '../hooks/useAnimatedHome';

export const HomeMediaItem = React.memo(
  ({item, index, ITEM_WIDTH, ITEM_HEIGHT, scrollX, FLAT_LIST_WINDOW_WIDTH}) => {
    const {translateX, scale, opacity} = useAnimatedHome({
      index,
      ITEM_WIDTH,
      FLAT_LIST_WINDOW_WIDTH,
      scrollX,
    });

    return (
      <Animated.View
        style={[
          styles.container,
          {
            width: ITEM_WIDTH,
            opacity,
            transform: [{translateX}, {scale}],
          },
        ]}>
        <FastImage
          source={{
            uri: item.poster_path
              ? `${BASE_IMAGE_URL}w500${item.poster_path}`
              : DEFAULT_MOVIE_IMAGE,
          }}
          style={[styles.image, {width: ITEM_WIDTH * 0.9, height: ITEM_HEIGHT}]}
        />
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    borderRadius: 20,
  },
});
