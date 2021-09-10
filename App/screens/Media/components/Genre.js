import {useTheme} from '@react-navigation/native';
import React, {useCallback, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, Animated} from 'react-native';
import {COLORS} from '../../../consts/consts';

export const Genre = ({genre, isActive, onSetGenre, mode}) => {
  const onPress = useCallback(() => {
    mode === 'genre' && onSetGenre(genre.id);
  }, [mode]);

  const {colors} = useTheme();

  const value = useRef(new Animated.Value(0)).current;

  Animated.spring(value, {
    toValue: isActive ? 1 : 0,
    useNativeDriver: true,
  }).start();

  // Animated.timing(value, {
  //   toValue: isActive ? 1 : 0,
  //   duration: 500,
  //   easing: Easing.linear,
  //   useNativeDriver: true,
  // }).start();

  //   const backgroundColor = scale.interpolate({
  //     inputRange: [0, 1],
  //     outputRange: ['transparent', '#20BBF6'],
  //   });

  return (
    <TouchableOpacity
      style={styles.genreContainer}
      activeOpacity={0.6}
      onPress={onPress}>
      <Animated.View style={[styles.genreBlock, {borderColor: colors.text}]}>
        <Animated.View
          style={[
            styles.internalBackGround,
            {opacity: mode === 'genre' ? value : 0},
          ]}
        />
        <Text
          style={{color: mode === 'genre' && isActive ? 'red' : colors.text}}>
          {genre.name}
        </Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.dash,
          {transform: [{scale: mode === 'genre' ? value : 0}]},
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  genreContainer: {
    marginHorizontal: 5,
    justifyContent: 'space-between',
  },

  genreBlock: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.BLACK,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  },

  internalBackGround: {
    position: 'absolute',
    ...StyleSheet.absoluteFill,
    backgroundColor: '#56CBFB',
    borderRadius: 10,
  },

  dash: {
    borderBottomColor: COLORS.BLUE,
    borderBottomWidth: 3,
    marginLeft: 5,
    width: '60%',
  },
});
