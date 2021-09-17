import React from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';

const OVERFLOW_HEIGHT = 50;

export const OverflowItems = ({data, scrollXAnimated}) => {
  const inputRange = [-1, 0, 1];

  const translateY = scrollXAnimated.interpolate({
    inputRange,
    outputRange: [OVERFLOW_HEIGHT, 0, -OVERFLOW_HEIGHT],
  });

  return (
    <View style={styles.overflowItemsContainer}>
      <Animated.View style={{transform: [{translateY}]}}>
        {data.map((item, index) => {
          const title = item.media_type === 'movie' ? item.title : item.name;
          return (
            <View key={index} style={styles.overflowItem}>
              <Text style={styles.title}>
                {title.length > 16
                  ? `${title.slice(0, 15).toUpperCase()}...`
                  : title.toUpperCase()}
              </Text>
            </View>
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
    fontWeight: 'bold',
  },
});
