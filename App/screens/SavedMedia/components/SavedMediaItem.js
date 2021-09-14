import {useTheme} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {Platform} from 'react-native';
import {StyleSheet, Text, View, Animated} from 'react-native';
import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {
  BASE_IMAGE_URL,
  COLORS,
  DEFAULT_MOVIE_IMAGE,
} from '../../../consts/consts';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export const SavedMediaItem = ({
  index,
  lastIndex,
  item,
  width,
  height,
  itemWidth,
  itemHeight,
  horizontalSpace,
  scrollX,
}) => {
  const inputRange = [
    (index - 1) * itemWidth,
    index * itemWidth,
    (index + 1) * itemWidth,
  ];

  const partValue = useMemo(() => Platform.select({ios: 20, android: 50}), []);

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [partValue, -40, partValue],
  });

  const {colors} = useTheme();

  const translateX = Animated.add(
    scrollX,
    scrollX.interpolate({
      inputRange: [0, 0.00001 + itemWidth * index],
      outputRange: [
        index * horizontalSpace * 2,
        index === 0 ? 0 : -(itemWidth * index + horizontalSpace),
      ],
      extrapolateRight: 'clamp',
    }),
  );

  return (
    <>
      {Platform.OS === 'android' && (
        <AnimatedFastImage
          source={{
            uri: item.backdrop_path
              ? `${BASE_IMAGE_URL}w1280${item.backdrop_path}`
              : DEFAULT_MOVIE_IMAGE,
          }}
          resizeMode="cover"
          style={{
            width,
            height: height,
            position: 'absolute',
            transform: [{translateX: translateX}],
          }}>
          <LinearGradient
            colors={['transparent', colors.background]}
            style={{position: 'absolute', ...StyleSheet.absoluteFill}}
          />
        </AnimatedFastImage>
      )}

      <Animated.View
        style={[
          styles.container,
          {
            width: itemWidth,
            height: itemHeight,
            marginLeft: index === 0 ? horizontalSpace : 0,
            marginRight: index === lastIndex ? horizontalSpace : 0,
            transform: [{translateY}],
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
            {
              width: itemWidth * 0.9,
              height: itemHeight * 0.9,
            },
          ]}>
          <View style={styles.topBlock}>
            <View style={styles.outSideCircle}>
              <View style={styles.insideCircle}>
                <Text style={styles.voteText}>{item.vote_average}</Text>
              </View>
            </View>

            <Icon type="antdesign" name="delete" color="red" />
          </View>

          <Text style={styles.title}>{item.title}</Text>
        </FastImage>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    alignItems: 'center',
  },

  image: {
    borderRadius: 20,
    padding: 20,
  },

  topBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  outSideCircle: {
    width: 45,
    height: 45,
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.DARK_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
  },

  insideCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.DARK_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
  },

  voteText: {
    color: COLORS.DARK_YELLOW,
    fontWeight: 'bold',
    textShadowColor: COLORS.BG_TRANSPARENT_GRAY,
    textShadowOffset: {height: 0.5, width: 0.5},
    textShadowRadius: 1,
  },

  title: {
    fontSize: 25,
    alignSelf: 'center',
    color: COLORS.WHITE,
    textShadowColor: COLORS.BLACK,
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 3,
    marginTop: 25,
  },
});
