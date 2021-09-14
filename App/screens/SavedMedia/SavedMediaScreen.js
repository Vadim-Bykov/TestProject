import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  Animated,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import {useQuery, useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';
import {Backdrop} from './components/Backdrop';
import * as tmdbServices from '../../api/tmdbService';
import {Loader} from '../../common/Loader';
import * as actionsCommon from '../../store/common/actions';
import {SavedMediaItem} from './components/SavedMediaItem';
import * as utils from '../../utils/utils';
import {EmptyList} from '../../common/EmptyList';

export const SavedMediaScreen = () => {
  // const queryClient = useQueryClient();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const {width, height} = useWindowDimensions();
  const flatListRef = useRef(null);

  const {data, isError, isLoading, isFetching, error} = useQuery(
    ['savedMediaList', page],
    () => tmdbServices.getList(page),
  );

  useEffect(() => {
    isError && error && console.log(error.response?.data.status_message);
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
    index => flatListRef?.current.scrollToIndex({index}),
    [flatListRef],
  );

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <SavedMediaItem
          index={index}
          isLastIndex={data?.results.length - 1 === index}
          item={item}
          width={width}
          height={height}
          itemWidth={ITEM_WIDTH}
          itemHeight={ITEM_HEIGHT}
          horizontalSpace={HORIZONTAL_SPACE}
          scrollX={scrollX}
          scrollToEnd={scrollToEnd}
        />
      );
    },
    [data, width, flatListRef],
  );

  return (
    <View style={styles.container}>
      {(isLoading || isFetching) && <Loader />}

      {Platform.OS === 'ios' && (
        <Backdrop
          mediaData={utils.reverseData(data?.results)}
          width={width}
          height={height}
          scrollX={scrollX}
          itemWidth={ITEM_WIDTH}
        />
      )}

      <Animated.FlatList
        ref={flatListRef}
        data={utils.reverseData(data?.results)}
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
        ListEmptyComponent={<EmptyList itemName="media" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
