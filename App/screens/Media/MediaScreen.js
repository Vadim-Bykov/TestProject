import React, {createContext, useCallback, useContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {useQuery} from 'react-query';
import * as tmdbService from '../../api/tmdbService';

const MediaContext = createContext();

export const useMediaContext = () => useContext(MediaContext);

export const MediaScreen = ({navigation}) => {
  const [mediaType, setMediaType] = useState('movie');
  const [timeWindow, setTimeWindow] = useState('week');
  const [page, setPage] = useState(1);

  const media = useQuery(['mediaData', mediaType, timeWindow, page], () =>
    tmdbService.getMovies({mediaType, timeWindow, page}),
  );

  const genres = useQuery(['genres', mediaType], () =>
    tmdbService.getGenres(mediaType),
  );

  console.log('media', media.data);
  console.log('genres', genres.data);

  const goToDetails = useCallback(() => navigation.navigate('Details'), []);

  return (
    <MediaContext.Provider
      value={{
        mediaType,
        setMediaType,
        timeWindow,
        setTimeWindow,
        page,
        setPage,
      }}>
      <View style={styles.container}>
        <Text>Movies</Text>
        <Button title="Details" onPress={goToDetails} />
        <Button
          title={`Page ${page}`}
          onPress={() => setPage(prev => prev + 1)}
        />

        <Button
          title={`Media type ${mediaType}`}
          onPress={() =>
            setMediaType(prev => (prev === 'movie' ? 'tv' : 'movie'))
          }
        />
      </View>
    </MediaContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
