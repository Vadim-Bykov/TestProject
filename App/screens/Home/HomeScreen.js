import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as actionsCommon from '../../store/common/actions';
import {useDispatch} from 'react-redux';
import {Loader} from '../../common/Loader';
import {useQuery, useQueryClient} from 'react-query';
import * as tmdbService from '../../api/tmdbService';
import {extractErrorMessage} from '../../utils/utils';
import {ButtonBlock} from './components/ButtonBlock';
import {HomePager} from './components/HomePager/HomePager';

const SPACING = 10;

export const HomeScreen = ({navigation}) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [mediaType, setMediaType] = useState('movie');

  const goToDetails = useCallback((id, mediaType) => {
    navigation.navigate('Details', {id, mediaType});
  }, []);

  const {data, error, isError, isLoading, isFetching} = useQuery(
    ['movieData', page],
    () => tmdbService.getMovies({mediaType, page, timeWindow: 'week'}),
    {keepPreviousData: true},
  );

  useEffect(() => {
    isError && dispatch(actionsCommon.setError(extractErrorMessage(error)));
  }, [isError]);

  useEffect(() => {
    queryClient.prefetchQuery(['movieData', page + 1], () =>
      tmdbService.getMovies({mediaType, page: page + 1, timeWindow: 'week'}),
    );
  }, [page]);

  return (
    <>
      {isLoading && <Loader />}

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <HomePager
            data={data}
            goToDetails={goToDetails}
            isFetching={isFetching}
          />

          <ButtonBlock
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            totalPages={data?.total_pages}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
  },

  scrollViewContainer: {
    flexGrow: 1,
    // backgroundColor: 'orange',
    padding: SPACING,
  },
});
