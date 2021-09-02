import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import * as tmdbService from '../../api/tmdbService';
import * as actionsMedia from '../../store/media/actions';
import * as actionsCommon from '../../store/common/actions';
import * as selectorsMedia from '../../store/media/selectors';
import * as selectorsCommon from '../../store/common/selectors';
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
  const error = useSelector(selectorsCommon.getError);

  const dispatch = useDispatch();

  const media =
    activeGenre && mode === 'genre'
      ? useQuery(['mediaData', mediaType, activeGenre, page], () =>
          tmdbService.getMediaByGenre({
            mediaType,
            genreId: activeGenre,
            page,
          }),
        )
      : useQuery(['mediaData', mediaType, timeWindow, page], () =>
          tmdbService.getMovies({mediaType, timeWindow, page}),
        );

  const genres = useQuery(['genres', mediaType], () =>
    tmdbService.getGenres(mediaType),
  );

  useEffect(() => {
    if (media.data) dispatch(actionsMedia.setMediaData(media.data.results));
    if (genres.data) dispatch(actionsMedia.setGenres(genres.data.genres));
  }, [media.data, genres.data]);

  useEffect(() => {
    if (media?.isError) dispatch(actionsCommon.setError(media.error.message));
    if (genres?.isError) dispatch(actionsCommon.setError(genres.error.message));
  }, [media?.isError, genres?.isError]);

  const goToDetails = useCallback(() => navigation.navigate('Details'), []);

  const toggleMode = useCallback(() => {
    setIsTrending(prev => !prev);
    setMode(mode === 'trending' ? 'genre' : 'trending');
  }, [mode, genres]);

  const toggleMediaType = useCallback(() => {
    // setMediaType(prev => (prev === 'movie' ? 'tv' : 'movie'))
    dispatch(actionsMedia.setMediaType(mediaType === 'movie' ? 'tv' : 'movie'));
    dispatch(actionsMedia.setActiveGenre(genres.data?.genres[0].id));
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
      {error && <Error />}
      {isLoader && <Loader />}

      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Genres genres={genres.data?.genres} mode={mode} />

          <ModeSwitch isTrending={isTrending} toggleMode={toggleMode} />
          <MediaTypeToggle
            mediaType={mediaType}
            toggleMediaType={toggleMediaType}
          />

          <Pager mediaDate={media.data?.results} mediaType={mediaType} />

          <Button title="Details" onPress={goToDetails} />
          <Button
            title={`Page ${page}`}
            onPress={() => dispatch(actionsMedia.setPage(page + 1))}
          />
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
