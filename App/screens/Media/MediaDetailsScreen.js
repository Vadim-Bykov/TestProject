import React, {useCallback, useLayoutEffect, useState} from 'react';
import {StyleSheet, Text, ScrollView, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import * as selectorsMedia from '../../store/media/selectors';
import * as selectorsCommon from '../../store/common/selectors';
import * as tmdbService from '../../api/tmdbService';
import {Error} from '../../common/Error';
import FastImage from 'react-native-fast-image';
import {BASE_IMAGE_URL, DEFAULT_MOVIE_IMAGE} from '../../consts/consts';
import {SharedElement} from 'react-navigation-shared-element';
import {StarBlock} from './components/StarBlock';
import {DetailsPageGenres} from './components/DetailsPageGenres';
import {Overview} from './components/Overview';
import {CastInfo} from './components/CastInfo';
import {ThemeText} from '../../common/ThemeText';

export const SPACE = 15;

export const MediaDetailsScreen = ({navigation, route}) => {
  // const dispatch = useDispatch();
  const {id, mediaType} = route.params;
  const {width} = useWindowDimensions();
  const error = useSelector(selectorsCommon.getError);
  const mediaData = useSelector(selectorsMedia.getMediaData);
  const allGenres = useSelector(selectorsMedia.getGenres);
  const [isTransitionEnd, setIsTransitionEnd] = useState(false);

  const setTransitionEnd = useCallback(() => {
    setIsTransitionEnd(prev => !prev);
  }, [isTransitionEnd]);

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionEnd',
      setTransitionEnd,
    );
    return unsubscribe;
  }, []);

  const mediaDetails = mediaData.find(movie => movie.id === id);
  const title =
    mediaType === 'movie' ? mediaDetails.title : mediaDetails.original_name;

  const currentGenres = allGenres.filter(genre =>
    mediaDetails.genre_ids.includes(genre.id),
  );

  return (
    <>
      {error && <Error />}

      {/* <SafeAreaView style={styles.container}> */}
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* <SharedElement id={id.toString()}> */}
        <FastImage
          source={{
            uri: mediaDetails.poster_path
              ? `${BASE_IMAGE_URL}w500${mediaDetails.poster_path}`
              : DEFAULT_MOVIE_IMAGE,
          }}
          style={[styles.poster, {width, height: width * 1.2}]}
        />
        {/* </SharedElement> */}

        <StarBlock width={width} mediaDetails={mediaDetails} />

        <ThemeText style={styles.title}>{title}</ThemeText>

        <DetailsPageGenres
          currentGenres={currentGenres}
          isTransitionEnd={isTransitionEnd}
        />

        <Overview
          overviewText={mediaDetails.overview}
          isTransitionEnd={isTransitionEnd}
          width={width}
        />

        <CastInfo id={id} mediaType={mediaType} width={width} />
      </ScrollView>
      {/* </SafeAreaView> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },

  scrollViewContainer: {
    flexGrow: 1,
  },

  poster: {
    borderBottomLeftRadius: 50,
  },

  title: {
    marginLeft: SPACE,
    marginTop: SPACE,
    fontSize: 25,
  },
});
