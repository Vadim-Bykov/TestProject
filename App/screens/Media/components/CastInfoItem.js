import React, {useLayoutEffect, useRef} from 'react';
import {Animated, StyleSheet, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ThemeText} from '../../../common/ThemeText';
import {BASE_IMAGE_URL, DEFAULT_AVATAR} from '../../../consts/consts';

export const CastInfoItem = ({
  index,
  profileName,
  profilePath,
  scroll,
  FLAT_LIST_WINDOW_WIDTH,
  ITEM_WIDTH,
}) => {
  // define position with scroll
  const position = Animated.subtract(index * ITEM_WIDTH, scroll);

  const isDisappearing = -ITEM_WIDTH;
  const isLeft = 0;
  const isRight = FLAT_LIST_WINDOW_WIDTH - ITEM_WIDTH;
  const isAppearing = FLAT_LIST_WINDOW_WIDTH;

  // Add translateX to scroll items
  const translateX = Animated.add(
    // stop items at the left side of the container
    Animated.add(
      scroll,
      scroll.interpolate({
        inputRange: [0, 0.00001 + index * ITEM_WIDTH],
        outputRange: [0, -index * ITEM_WIDTH],
        extrapolateRight: 'clamp',
      }),
    ),
    // add Animated.add to start showing items from right side
    position.interpolate({
      inputRange: [isRight, isAppearing],
      outputRange: [0, -ITEM_WIDTH],
      extrapolate: 'clamp',
    }),
  );

  // Add one more Animated add to show and disappear items in half of ITEM_WIDTH at left and right sides

  //   const translateX = Animated.add(
  //     Animated.add(
  //       Animated.add(
  //         scroll,
  //         scroll.interpolate({
  //           inputRange: [0, 0.00001 + index * ITEM_WIDTH],
  //           outputRange: [0, -index * ITEM_WIDTH],
  //           extrapolateRight: 'clamp',
  //         }),
  //       ),
  //       position.interpolate({
  //         inputRange: [isRight, isAppearing],
  //         outputRange: [0, -ITEM_WIDTH / 2],
  //         extrapolate: 'clamp',
  //       }),
  //     ),
  //     position.interpolate({
  //       inputRange: [isDisappearing, isLeft],
  //       outputRange: [-ITEM_WIDTH / 2, 0],
  //       extrapolate: 'clamp',
  //     }),
  //   );

  const scale = position.interpolate({
    inputRange: [isDisappearing, isLeft, isRight, isAppearing],
    outputRange: [0.5, 1, 1, 0.5],
    extrapolate: 'clamp',
  });

  const rotate = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    Animated.timing(rotate, {
      toValue: 100,
      duration: 1000,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const rotateY = rotate.interpolate({
    inputRange: [0, 100],
    outputRange: ['-90deg', '0deg'],
  });

  const opacity = position.interpolate({
    inputRange: [isDisappearing, isLeft, isRight, isAppearing],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.itemContainer,
        {
          width: ITEM_WIDTH,
          opacity,
          transform: [{translateX}, {scale}, {rotateY}, {perspective: 1000}],
        },
      ]}>
      <FastImage
        source={{
          uri: profilePath
            ? `${BASE_IMAGE_URL}/w300/${profilePath}`
            : DEFAULT_AVATAR,
        }}
        style={{
          width: ITEM_WIDTH * 0.8,
          height: ITEM_WIDTH * 0.8,
          borderRadius: (ITEM_WIDTH * 0.8) / 2,
        }}
      />
      <ThemeText style={styles.name}>{profileName}</ThemeText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
  },

  name: {
    textAlign: 'center',
  },
});
