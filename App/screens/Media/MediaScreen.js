import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {useQuery, useQueryClient} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import * as tmdbService from '../../api/tmdbService';
import * as actionsMedia from '../../store/media/actions';
import * as actionsCommon from '../../store/common/actions';
import * as selectorsMedia from '../../store/media/selectors';
import {Genres} from './components/Genres';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ModeSwitch} from './components/ModeSwitch';
import {MediaTypeToggle} from './components/MediaTypeToggle';
import {Loader} from '../../common/Loader';
import {Pager} from './components/Pager';

// const MediaContext = createContext();
// export const useMediaContext = () => useContext(MediaContext);

export const MediaScreen = ({navigation}) => {
  // const [mediaType, setMediaType] = useState('movie');
  // const [timeWindow, setTimeWindow] = useState('week');
  // const [page, setPage] = useState(1);

  const [isTrending, setIsTrending] = useState(false);
  const [mode, setMode] = useState('trending');
  const mediaType = useSelector(selectorsMedia.getMediaType);
  const timeWindow = useSelector(selectorsMedia.getTimeWindow);
  const page = useSelector(selectorsMedia.getPage);
  const activeGenre = useSelector(selectorsMedia.getActiveGenre);

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const media =
    activeGenre && mode === 'genre'
      ? useQuery(
          ['mediaData', mediaType, activeGenre, page],
          () =>
            tmdbService.getMediaByGenre({
              mediaType,
              genreId: activeGenre,
              page,
            }),
          {keepPreviousData: true},
        )
      : useQuery(
          ['mediaData', mediaType, timeWindow, page],
          () => tmdbService.getMovies({mediaType, timeWindow, page}),
          {keepPreviousData: true},
        );

  const genres = useQuery(['genres', mediaType], () =>
    tmdbService.getGenres(mediaType),
  );

  useEffect(() => {
    if (media.data?.total_pages > page) {
      activeGenre && mode === 'genre'
        ? queryClient.prefetchQuery(
            ['mediaData', mediaType, activeGenre, page + 1],
            () =>
              tmdbService.getMediaByGenre({
                mediaType,
                genreId: activeGenre,
                page: page + 1,
              }),
          )
        : queryClient.prefetchQuery(
            ['mediaData', mediaType, timeWindow, page + 1],
            () =>
              tmdbService.getMovies({mediaType, timeWindow, page: page + 1}),
          );
    }
  }, [media.data, mediaType, activeGenre, page, queryClient]);

  useEffect(() => {
    if (media.data) {
      dispatch(actionsMedia.setMediaData(media.data.results));
      dispatch(actionsMedia.setTotalPages(media.data.total_pages));
    }
    if (genres.data) dispatch(actionsMedia.setGenres(genres.data.genres));
  }, [media.data, genres.data]);

  useEffect(() => {
    if (media?.isError)
      dispatch(
        actionsCommon.setError(media.error.response.data.status_message),
      );
    if (genres?.isError)
      dispatch(
        actionsCommon.setError(genres.error.response.data.status_message),
      );
  }, [media?.isError, genres?.isError]);

  const goToDetails = useCallback((id, mediaType) => {
    navigation.navigate('Details', {id, mediaType});
  }, []);

  const toggleMode = useCallback(() => {
    setIsTrending(prev => !prev);
    setMode(mode === 'trending' ? 'genre' : 'trending');
    dispatch(actionsMedia.setPage(1));
  }, [mode, genres]);

  const toggleMediaType = useCallback(() => {
    // setMediaType(prev => (prev === 'movie' ? 'tv' : 'movie'))
    dispatch(actionsMedia.setMediaType(mediaType === 'movie' ? 'tv' : 'movie'));
    dispatch(actionsMedia.setActiveGenre(genres.data?.genres[0].id));
    dispatch(actionsMedia.setPage(1));
  }, [mediaType, genres.data]);

  useEffect(() => {
    dispatch(actionsMedia.setActiveGenre(genres.data?.genres[0].id));
  }, [genres.data]);

  const isLoader = useMemo(() => {
    return (
      genres.isLoading ||
      genres.isFetching ||
      media.isLoading ||
      media.isFetching
    );
  }, [genres.isLoading, genres.isFetching, media.isLoading, media.isFetching]);

  return (
    <>
      {isLoader && <Loader />}

      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Genres genres={genres.data?.genres} mode={mode} />

          <ModeSwitch isTrending={isTrending} toggleMode={toggleMode} />
          <MediaTypeToggle
            mediaType={mediaType}
            toggleMediaType={toggleMediaType}
          />

          <Pager mediaType={mediaType} goToDetails={goToDetails} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollViewContainer: {
    alignItems: 'center',
  },
});
