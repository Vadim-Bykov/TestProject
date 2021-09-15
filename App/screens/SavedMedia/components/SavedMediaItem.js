import {useTheme} from '@react-navigation/native';
import React, {useCallback, useMemo} from 'react';
import {Platform} from 'react-native';
import {StyleSheet, Text, Animated} from 'react-native';
import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {
  BASE_IMAGE_URL,
  COLORS,
  DEFAULT_MOVIE_IMAGE,
} from '../../../consts/consts';
import {useAnimatedSavedItem} from '../hooks/useAnimatedSavedItem';
import {AnimatedBackground} from './AnimatedBackground';
import {TopPart} from './TopPart';

export const SavedMediaItem = ({
  index,
  isLastIndex,
  item,
  width,
  height,
  itemWidth,
  itemHeight,
  horizontalSpace,
  scrollX,
  scrollToEnd,
  goToDetailsScreen,
}) => {
  const {colors} = useTheme();

  const goToDetails = useCallback(() => {
    goToDetailsScreen(item.id, item.media_type);
  }, []);

  const {translateY, translateX} = useAnimatedSavedItem({
    index,
    itemWidth,
    scrollX,
    horizontalSpace,
  });

  const title = useMemo(
    () => (item.media_type === 'movie' ? item.title : item.name),
    [],
  );

  return (
    <>
      {Platform.OS === 'android' && (
        <AnimatedBackground
          backdropPath={item.backdrop_path}
          translateX={translateX}
          width={width}
          height={height}
          backgroundColor={colors.background}
        />
      )}

      <Animated.View
        style={[
          styles.container,
          {
            width: itemWidth,
            height: itemHeight,
            marginLeft: index === 0 ? horizontalSpace : 0,
            marginRight: isLastIndex ? horizontalSpace : 0,
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
          <TopPart
            id={item.id}
            mediaType={item.media_type}
            voteAverage={item.vote_average}
            scrollToEnd={scrollToEnd}
            isLastIndex={isLastIndex}
            index={index}
          />

          <Icon
            type="entypo"
            name="info"
            color={COLORS.DARK_YELLOW}
            containerStyle={styles.infoIcon}
            onPress={goToDetails}
          />
        </FastImage>

        <Text style={[styles.title, {textShadowColor: colors.text}]}>
          {title.length > 25 ? `${title.slice(0, 24)}...` : title}
        </Text>
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
    justifyContent: 'space-between',
  },

  infoIcon: {
    alignSelf: 'flex-end',
  },

  title: {
    fontSize: 25,
    alignSelf: 'center',
    color: COLORS.WHITE,
    // textShadowColor: COLORS.BLACK,
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 3,
    textAlign: 'center',
    width: Platform.select({
      ios: '100%',
      android: '90%',
    }),
  },
});
