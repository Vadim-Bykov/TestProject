import React from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';
import {ThemeText} from '../../../../common/ThemeText';

const OVERFLOW_HEIGHT = 50;

export const OverflowTitles = ({mediaDate, scroll, itemWidth}) => {
  // const inputRange = [-1, 0, 1];
  const inputRange = [-itemWidth, 0, itemWidth];

  const translateY = scroll.interpolate({
    inputRange,
    outputRange: [OVERFLOW_HEIGHT, 0, -OVERFLOW_HEIGHT],
  });

  return (
    <View style={styles.overflowItemsContainer}>
      <Animated.View style={{transform: [{translateY}]}}>
        {mediaDate.map((item, index) => {
          const title = item.media_type === 'movie' ? item.title : item.name;

          const inputRange = [
            -itemWidth,
            0,
            itemWidth * (index === 0 ? index : index - 1),
            itemWidth * index,
            itemWidth * (index + 1),
          ];

          const scale = scroll.interpolate({
            inputRange,
            outputRange: [0.7, index === 1 ? 0.7 : 1, 0.7, 1, 0.3],
            extrapolate: 'clamp',
          });

          const opacity = scroll.interpolate({
            inputRange,
            outputRange: [0, index === 1 ? 0 : 1, 0, 1, -0.5],
          });

          return (
            <Animated.View
              key={index}
              style={[styles.overflowItem, {opacity, transform: [{scale}]}]}>
              <ThemeText style={styles.title}>
                {title.length > 16
                  ? `${title.slice(0, 15).toUpperCase()}...`
                  : title.toUpperCase()}
              </ThemeText>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overflowItemsContainer: {
    height: OVERFLOW_HEIGHT,
    overflow: 'hidden',
  },

  overflowItem: {
    height: OVERFLOW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  title: {
    fontSize: 30,
  },
});
