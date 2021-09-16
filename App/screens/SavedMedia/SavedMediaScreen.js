import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  Animated,
  View,
  ScrollView,
  Platform,
  RefreshControl,
} from 'react-native';
import {useInfiniteQuery, useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import {Backdrop} from './components/Backdrop';
import * as tmdbServices from '../../api/tmdbService';
import {Loader} from '../../common/Loader';
import * as actionsCommon from '../../store/common/actions';
import {SavedMediaItem} from './components/SavedMediaItem';
import {EmptyList} from '../../common/EmptyList';
import {COLORS} from '../../consts/consts';

export const SavedMediaScreen = ({navigation}) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const [mediaData, setMediaData] = useState([]);
  const [isTransformData, setIsTransformData] = useState(true);
  // const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const {width, height} = useWindowDimensions();
  const flatListRef = useRef(null);

  const goToDetailsScreen = useCallback((id, mediaType) => {
    navigation.navigate('SavedDetails', {id, mediaType});
  }, []);

  // const {data, isError, isLoading, isFetching, error} = useQuery(
  //   ['savedMediaList', page],
  //   () => tmdbServices.getList(page),
  // );

  const {
    data,
    isError,
    isLoading,
    isFetching,
    error,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery('savedMediaList', tmdbServices.getInfinityList, {
    getNextPageParam: pageParam => pageParam.next,
  });

  useEffect(() => {
    setMediaData([]);
    // setIsTransformData(prev => !prev);
    const mediaSet = new Set();

    data?.pages.forEach(page => {
      page.data.results.forEach(media => {
        if (!mediaSet.has(media.id)) {
          mediaSet.add(media.id);
          setMediaData(prev => [...prev, media]);
        }
      });
    });

    data?.pages && setIsTransformData(false);
  }, [data, hasNextPage]);

  const loadNextPage = useCallback(() => {
    hasNextPage && fetchNextPage();
  }, [hasNextPage]);

  useEffect(() => {
    isError &&
      dispatch(actionsCommon.setError(error?.response?.data.status_message));
  }, [isError, error]);

  const ITEM_HEIGHT = Platform.select({
    ios: width * 1.1,
    android: width * 1.4,
  });
  const ITEM_WIDTH = Platform.select({
    ios: Math.ceil(width * 0.72),
    android: Math.ceil(width * 0.9),
  });
  const HORIZONTAL_SPACE = (width - ITEM_WIDTH) / 2;

  const getItemLayout = useCallback(
    (_, index) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [],
  );

  const scrollToEnd = useCallback(
    index => index >= 0 && flatListRef?.current.scrollToIndex({index}),
    [flatListRef],
  );

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <SavedMediaItem
          index={index}
          isLastIndex={mediaData.length - 1 === index}
          item={item}
          width={width}
          height={height}
          itemWidth={ITEM_WIDTH}
          itemHeight={ITEM_HEIGHT}
          horizontalSpace={HORIZONTAL_SPACE}
          scrollX={scrollX}
          scrollToEnd={scrollToEnd}
          goToDetailsScreen={goToDetailsScreen}
        />
      );
    },
    [mediaData, width, flatListRef],
  );

  const isShowLoader = useMemo(
    () =>
      isLoading ||
      isTransformData ||
      Platform.select({ios: isFetching, android: false}),
    [isLoading, isFetching, isTransformData],
  );

  return (
    <View style={styles.container}>
      {isShowLoader && <Loader />}

      {Platform.OS === 'ios' && (
        <Backdrop
          mediaData={mediaData}
          width={width}
          height={height}
          scrollX={scrollX}
          itemWidth={ITEM_WIDTH}
        />
      )}

      <Animated.FlatList
        ref={flatListRef}
        data={mediaData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        horizontal
        snapToInterval={ITEM_WIDTH}
        decelerationRate={0.88}
        bounces={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        ListEmptyComponent={
          isTransformData ? null : <EmptyList itemName="media" />
        }
        onEndReached={loadNextPage}
        // Maybe because of snapToInterval function onEndReached calls after adding integer (number of items before end reached)
        onEndReachedThreshold={5}
        refreshControl={
          <RefreshControl
            refreshing={Platform.select({ios: false, android: isFetching})}
            progressViewOffset={50}
            tintColor={COLORS.DARK_YELLOW}
          />
        }
        contentContainerStyle={
          Platform.OS === 'android' && {flex: 1, justifyContent: 'center'}
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
