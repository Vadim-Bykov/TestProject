import React, {useRef} from 'react';
import {useLayoutEffect} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../consts/consts';
import {SPACE} from '../MediaDetailsScreen';

export const DetailsPageGenres = ({currentGenres, isTransitionEnd}) => {
  const delay = 200;

  const genres = currentGenres.map((genre, index) => {
    const scale = useRef(new Animated.Value(0)).current;

    useLayoutEffect(() => {
      isTransitionEnd &&
        Animated.spring(scale, {
          toValue: 1,
          delay: delay * index,
          useNativeDriver: true,
        }).start();
    }, [isTransitionEnd]);

    return (
      <Animated.View
        key={genre.id}
        style={[styles.genre, {transform: [{scale}]}]}>
        <Text>{genre.name}</Text>
      </Animated.View>
    );
  });

  return <View style={styles.container}>{genres}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: SPACE,
  },

  genre: {
    margin: 10,
    marginLeft: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.BLACK,
  },
});
