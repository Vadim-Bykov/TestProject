import React, {useLayoutEffect, useMemo, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {SPACE} from '../MediaDetailsScreen';

export const Overview = React.memo(({overviewText, isTransitionEnd, width}) => {
  const value = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    isTransitionEnd &&
      Animated.spring(value, {toValue: 100, useNativeDriver: true}).start();
  }, [isTransitionEnd]);

  const translateTitle = useMemo(() => {
    return value.interpolate({
      inputRange: [0, 100],
      outputRange: [width, 0],
    });
  }, []);

  const translateOverviewText = useMemo(() => {
    return value.interpolate({
      inputRange: [0, 100],
      outputRange: [-width, 0],
    });
  }, []);

  return (
    <Animated.View style={styles.container}>
      <Animated.Text
        style={[styles.title, {transform: [{translateX: translateTitle}]}]}>
        Plot Summary
      </Animated.Text>
      <Animated.Text
        style={[
          styles.overviewText,
          {transform: [{translateX: translateOverviewText}]},
        ]}>
        {overviewText}
      </Animated.Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACE,
  },

  title: {
    fontSize: 20,
    marginVertical: 5,
  },

  overviewText: {
    textAlign: 'justify',
  },
});
