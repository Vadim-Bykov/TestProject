import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import * as selectorsMedia from '../../store/media/selectors';
import * as tmdbService from '../../api/tmdbService';
import {useQuery} from 'react-query';
import * as actionsCommon from '../../store/common/actions';
import {extractErrorMessage} from '../../utils/utils';
import {Error} from '../../common/Error';
import {Loader} from '../../common/Loader';
import FastImage from 'react-native-fast-image';
import {BASE_IMAGE_URL, DEFAULT_MOVIE_IMAGE} from '../../consts/consts';

export const MediaDetailsScreen = ({route}) => {
  const {id, mediaType} = route.params;
  const dispatch = useDispatch();
  const mediaData = useSelector(selectorsMedia.getMediaData);
  const {width} = useWindowDimensions();

  const details = mediaData.find(movie => movie.id === id);
  console.log(details);

  // const {data, error, isError, isLoading} = useQuery(
  //   ['mediaDetails', id, mediaType],
  //   () => tmdbService.getDetails({mediaId: id, mediaType}),
  // );

  // useEffect(() => {
  //   isError &&
  //     dispatch(
  //       actionsCommon.setError(
  //         extractErrorMessage(media.error.response.data.status_message),
  //       ),
  //     );
  // }, [isError]);

  return (
    <>
      {/* {isLoading && <Loader />} */}
      {/* {isError && <Error />} */}

      {/* <SafeAreaView style={styles.container}> */}
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <FastImage
          source={{
            uri: details.poster_path
              ? `${BASE_IMAGE_URL}w500${details.poster_path}`
              : DEFAULT_MOVIE_IMAGE,
          }}
          style={{width, height: width * 1.2}}
        />
        <Text>Details</Text>
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
    alignItems: 'center',
    //  backgroundColor: 'green',
  },
});
