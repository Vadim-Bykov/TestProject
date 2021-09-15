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
import {setError} from '../../store/common/actions';
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
    console.log('error', isError && error?.response.data.status_message);
    isError && dispatch(setError(error.response.data.status_message));
  }, [isError]);

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

// import React, {
//   useCallback,
//   useEffect,
//   useLayoutEffect,
//   useMemo,
//   useState,
// } from 'react';
// import {StyleSheet, Text, ScrollView, useWindowDimensions} from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';
// import * as selectorsMedia from '../../store/media/selectors';
// import * as tmdbService from '../../api/tmdbService';
// import {Error} from '../../common/Error';
// import FastImage from 'react-native-fast-image';
// import {BASE_IMAGE_URL, DEFAULT_MOVIE_IMAGE} from '../../consts/consts';
// import {SharedElement} from 'react-navigation-shared-element';
// import {StarBlock} from './components/StarBlock';
// import {DetailsPageGenres} from './components/DetailsPageGenres';
// import {Overview} from './components/Overview';
// import {CastInfo} from './components/CastInfo';
// import {ThemeText} from '../../common/ThemeText';
// import {useQuery} from 'react-query';
// import {Loader} from '../../common/Loader';
// import {setError} from '../../store/common/actions';

// export const SPACE = 15;

// export const MediaDetailsScreen = ({navigation, route}) => {
//   const dispatch = useDispatch();
//   const {id, mediaType} = route.params;
//   const {width} = useWindowDimensions();
//   const stateMediaData = useSelector(selectorsMedia.getMediaData);
//   const allGenres = useSelector(selectorsMedia.getGenres);
//   const [isTransitionEnd, setIsTransitionEnd] = useState(false);

//   const {data, error, isError, isLoading} = useQuery(
//     ['Details', id, mediaType],
//     () => tmdbService.getDetails({mediaId: id, mediaType}),
//   );

//   const setTransitionEnd = useCallback(() => {
//     setIsTransitionEnd(prev => !prev);
//   }, [isTransitionEnd]);

//   useLayoutEffect(() => {
//     const unsubscribe = navigation.addListener(
//       'transitionEnd',
//       setTransitionEnd,
//     );
//     return unsubscribe;
//   }, []);

//   const mediaDetails = useMemo(
//     () =>
//       stateMediaData
//         ? stateMediaData.find(movie => movie.id === id) || data
//         : data,
//     [stateMediaData, data],
//   );

//   const title = useMemo(
//     () =>
//       mediaDetails &&
//       (mediaType === 'movie' ? mediaDetails.title : mediaDetails.original_name),
//     [mediaDetails],
//   );

//   const currentGenres = useMemo(
//     () =>
//       allGenres &&
//       (stateMediaData && mediaDetails
//         ? mediaDetails.genre_ids
//           ? allGenres.filter(genre => mediaDetails.genre_ids.includes(genre.id))
//           : data?.genres
//         : data?.genres),
//     [data, allGenres, mediaDetails],
//   );

//   useEffect(() => {
//     console.log('error', isError && error?.response.data.status_message);
//     isError && dispatch(setError(error.response.data.status_message));
//   }, [isError]);

//   return (
//     <>
//       {isLoading && <Loader />}

//       {mediaDetails ? (
//         <ScrollView contentContainerStyle={styles.scrollViewContainer}>
//           {/* <SharedElement id={id.toString()}> */}
//           <FastImage
//             source={{
//               uri: mediaDetails.poster_path
//                 ? `${BASE_IMAGE_URL}w500${mediaDetails.poster_path}`
//                 : DEFAULT_MOVIE_IMAGE,
//             }}
//             style={[styles.poster, {width, height: width * 1.2}]}
//           />
//           {/* </SharedElement> */}

//           <StarBlock width={width} mediaDetails={mediaDetails} />

//           <ThemeText style={styles.title}>{title}</ThemeText>

//           {currentGenres && (
//             <DetailsPageGenres
//               currentGenres={currentGenres}
//               isTransitionEnd={isTransitionEnd}
//             />
//           )}

//           <Overview
//             overviewText={mediaDetails.overview}
//             isTransitionEnd={isTransitionEnd}
//             width={width}
//           />

//           <CastInfo id={id} mediaType={mediaType} width={width} />
//         </ScrollView>
//       ) : null}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   scrollViewContainer: {
//     flexGrow: 1,
//   },

//   poster: {
//     borderBottomLeftRadius: 50,
//   },

//   title: {
//     marginLeft: SPACE,
//     marginTop: SPACE,
//     fontSize: 25,
//   },
// });
