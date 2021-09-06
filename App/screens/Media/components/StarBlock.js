import React, {useLayoutEffect, useRef} from 'react';
import {StyleSheet, Text, Animated} from 'react-native';
import {Icon} from 'react-native-elements';
import {colors} from '../../../consts/consts';

export const StarBlock = ({width, mediaDetails}) => {
  const value = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  const inputRange = [0, 100];

  useLayoutEffect(() => {
    Animated.sequence([
      Animated.timing(value, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
        delay: 300,
      }),

      Animated.spring(scale, {toValue: 1, useNativeDriver: true}),
    ]).start();
  }, []);

  const translateX = value.interpolate({
    inputRange,
    outputRange: [-width, 0],
  });

  return (
    <Animated.View style={[styles.starContainer, {transform: [{translateX}]}]}>
      <Animated.View style={[styles.voteAverage, {transform: [{scale}]}]}>
        <Icon type="antdesign" name="star" color="gold" />
        <Text>{mediaDetails.vote_average}</Text>
      </Animated.View>

      <Animated.View style={[styles.popularity, {transform: [{scale}]}]}>
        <Text style={styles.popularityText}>
          {Math.round(mediaDetails.popularity)}
        </Text>
      </Animated.View>

      <Animated.View style={[styles.voteAverage, {transform: [{scale}]}]}>
        <Icon type="ionicon" name="save-outline" color="blue" />
        <Text>Save</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  starContainer: {
    width: '90%',
    height: 100,
    marginTop: -50,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,

    backgroundColor: colors.WHITE,
    elevation: 10,

    shadowOpacity: 0.3,
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 5.46,
  },

  voteAverage: {
    alignItems: 'center',
  },

  popularity: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 3,
  },

  popularityText: {
    color: colors.WHITE,
  },
});
