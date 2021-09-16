import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {StyleSheet, ScrollView, useWindowDimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as selectorsMedia from '../../store/media/selectors';
import * as tmdbService from '../../api/tmdbService';
import FastImage from 'react-native-fast-image';
import {BASE_IMAGE_URL, DEFAULT_MOVIE_IMAGE} from '../../consts/consts';
import {SharedElement} from 'react-navigation-shared-element';
import {StarBlock} from './components/StarBlock';
import {DetailsPageGenres} from './components/DetailsPageGenres';
import {Overview} from './components/Overview';
import {CastInfo} from './components/CastInfo';
import {ThemeText} from '../../common/ThemeText';
import {useQuery} from 'react-query';
import {Loader} from '../../common/Loader';
import * as commonActions from '../../store/common/actions';
import {
  CommonActions,
  StackActions,
  useIsFocused,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';

export const SPACE = 15;

export const MediaDetailsScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {id, mediaType} = route.params;
  const {width} = useWindowDimensions();
  const [isTransitionEnd, setIsTransitionEnd] = useState(false);

  // const isFocused = useIsFocused();

  // if we go to another tab without going back to the 'Movies' Stack screen, we need to remove last route to get back to 'Movies' Stack screen to prevent bug after visiting  this screen from SavedMediaScreen
  // useEffect(() => {
  //   !isFocused &&
  //     navigation.getParent().getState().index !== 2 &&
  //     navigation.dispatch(state => {
  //       const initialCountRoutes = state.routes.length;

  //       const routes = state.routes.filter(route => route.name !== 'Details');

  //       console.log('initialCountRoutes', initialCountRoutes !== routes.length);

  //       if (initialCountRoutes !== routes.length) {
  //         return CommonActions.reset({
  //           ...state,
  //           routes,
  //           index: routes.length - 1,
  //         });
  //       }
  //     });
  //   // navigation.dispatch(StackActions.replace('Movies'));
  // }, [isFocused]);

  const {data, error, isError, isLoading} = useQuery(
    ['Details', id, mediaType],
    () => tmdbService.getDetails({mediaId: id, mediaType}),
  );

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

  const title = useMemo(
    () => (mediaType === 'movie' ? data?.title : data?.original_name),
    [data],
  );

  useEffect(() => {
    isError &&
      dispatch(commonActions.setError(error.response.data.status_message));
  }, [isError]);

  if (isError) return null;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}>
          {/* <SharedElement id={id.toString()}> */}
          <FastImage
            source={{
              uri: data.poster_path
                ? `${BASE_IMAGE_URL}w500${data.poster_path}`
                : DEFAULT_MOVIE_IMAGE,
            }}
            style={[styles.poster, {width, height: width * 1.2}]}
          />
          {/* </SharedElement> */}

          <StarBlock width={width} mediaDetails={data} />

          <ThemeText style={styles.title}>{title}</ThemeText>

          <DetailsPageGenres
            currentGenres={data.genres}
            isTransitionEnd={isTransitionEnd}
          />

          <Overview
            overviewText={data.overview}
            isTransitionEnd={isTransitionEnd}
            width={width}
          />

          <CastInfo id={id} mediaType={mediaType} width={width} />
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
