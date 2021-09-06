import React, {useCallback} from 'react';
import {StyleSheet, Text, View, Animated, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import {FAB} from 'react-native-elements/dist/buttons/FAB';
import FastImage from 'react-native-fast-image';
import {
  BASE_IMAGE_URL,
  colors,
  DEFAULT_MOVIE_IMAGE,
} from '../../../consts/consts';
import {useAnimated} from '../hooks/useAnimated';
import * as selectorsMedia from '../../../store/media/selectors';
import {useDispatch, useSelector} from 'react-redux';
import * as actionsMedia from '../../../store/media/actions';
import {SharedElement} from 'react-navigation-shared-element';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export const Slide = React.memo(
  ({
    id,
    posterPath,
    title,
    voteAverage,
    width,
    index,
    lastIndex,
    scroll,
    itemWidth,
    goToDetails,
    mediaType,
  }) => {
    const {opacity, shadowOpacity, elevation, scale, translateX} = useAnimated({
      scroll,
      index,
      width,
      itemWidth,
    });

    const page = useSelector(selectorsMedia.getPage);
    const totalPages = useSelector(selectorsMedia.getTotalPages);

    const dispatch = useDispatch();

    const goToNextPage = useCallback(() => {
      dispatch(
        actionsMedia.setPage(page === totalPages ? totalPages : page + 1),
      );
    }, [page, totalPages]);

    const goToPrevPage = useCallback(() => {
      dispatch(actionsMedia.setPage(page === 1 ? 1 : page - 1));
    }, [page, totalPages]);

    const goToDetailsScreen = useCallback(() => goToDetails(id, mediaType), []);

    return (
      <>
        {index === 0 && (
          <Icon
            type="ionicon"
            name="ios-arrow-undo"
            color={colors.BLUE}
            size={32}
            containerStyle={[styles.arrowLeft, {top: width / 2}]}
            onPress={goToPrevPage}
          />
        )}
        <Animated.View
          style={[
            styles.slideContainer,
            {
              width: width * 0.8,
              marginLeft: index === 0 ? width * 0.1 : 0,
              marginRight: index === lastIndex ? width * 0.1 : 0,

              shadowOpacity: shadowOpacity,
              transform: [{scale}, {translateX}],
            },
          ]}>
          {/* <SharedElement id={id.toString()}> */}
          <AnimatedFastImage
            source={{
              uri: posterPath
                ? `${BASE_IMAGE_URL}w500${posterPath}`
                : DEFAULT_MOVIE_IMAGE,
            }}
            style={[
              styles.image,
              {
                width: width * 0.75,
                height: width,
                // elevation,
              },
            ]}>
            <FAB
              placement="right"
              icon={<Icon type="entypo" name="info" color="gold" />}
              style={styles.FAB}
              onPress={goToDetailsScreen}
            />
          </AnimatedFastImage>
          {/* </SharedElement> */}

          <Animated.View style={[styles.infoBlock, {opacity}]}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.voteAverageBlock}>
              <Icon name="star" color="gold" />
              <Text>{voteAverage}</Text>
            </View>
          </Animated.View>
        </Animated.View>

        {index === lastIndex && (
          <Icon
            type="ionicon"
            name="ios-arrow-redo"
            color={colors.BLUE}
            size={32}
            containerStyle={[styles.arrowRight, {top: width / 2}]}
            onPress={goToNextPage}
          />
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  slideContainer: {
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 5.46,
  },

  infoBlock: {
    alignItems: 'center',
  },

  image: {
    borderRadius: 20,
  },

  title: {
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },

  voteAverageBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  arrowLeft: {
    position: 'absolute',
    left: 0,
    marginLeft: 6,
  },

  arrowRight: {
    position: 'absolute',
    right: 0,
    marginRight: 6,
  },
});
