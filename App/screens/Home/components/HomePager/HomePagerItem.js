import React, {useCallback, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {BASE_IMAGE_URL, DEFAULT_MOVIE_IMAGE} from '../../../../consts/consts';
import {useAnimatedHome} from '../../hooks/useAnimatedHome';

export const HomePagerItem = React.memo(
  ({
    item,
    index,
    ITEM_WIDTH,
    ITEM_HEIGHT,
    scrollX,
    FLAT_LIST_WINDOW_WIDTH,
    goToDetails,
  }) => {
    const {translateX, scale, opacity, rotateY} = useAnimatedHome({
      index,
      ITEM_WIDTH,
      FLAT_LIST_WINDOW_WIDTH,
      scrollX,
    });

    const goToDetailsScreen = useCallback(() => {
      goToDetails(item.id, item.media_type);
    }, []);

    return (
      <Animated.View
        style={[
          styles.container,
          {
            width: ITEM_WIDTH,
            opacity,
            transform: [
              {translateX},
              {rotateY},
              {perspective: 1000},
              // {scale: isLandScape ? scale : 1},
            ],
          },
        ]}>
        <FastImage
          source={{
            uri: item.poster_path
              ? `${BASE_IMAGE_URL}w500${item.poster_path}`
              : DEFAULT_MOVIE_IMAGE,
          }}
          style={[
            styles.image,
            {width: ITEM_WIDTH * 0.9, height: ITEM_HEIGHT},
          ]}>
          <Icon
            type="entypo"
            name="info"
            color="gold"
            containerStyle={styles.infoIcon}
            onPress={goToDetailsScreen}
          />
        </FastImage>
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
    justifyContent: 'flex-end',
    padding: 20,
    alignItems: 'flex-end',
  },

  infoIcon: {
    borderRadius: 25,
    padding: 5,
    backgroundColor: 'tomato',
  },
});
