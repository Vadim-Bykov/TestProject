import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import {StyleSheet, useWindowDimensions, View, Animated} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Directions,
  FlingGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useInfiniteQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import * as tmdbServices from '../../api/tmdbService';
import {Loader} from '../../common/Loader';
import {BASE_IMAGE_URL, DEFAULT_MOVIE_IMAGE} from '../../consts/consts';
import * as actionsCommon from '../../store/common/actions';
import {OverflowItems} from './components/OverflowItems';

const SPACING = 10;
const VISIBLE_ITEMS = 3;

export const SavedMediaGesture = () => {
  const [mediaData, setMediaData] = useState([]);
  const [index, setIndex] = useState(0);
  const {width} = useWindowDimensions();
  const dispatch = useDispatch();
  const scrollXIndex = useRef(new Animated.Value(0)).current;
  const scrollXAnimated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scrollXAnimated, {
      toValue: scrollXIndex,
      useNativeDriver: true,
    }).start();
  }, []);

  const ITEM_WIDTH = width * 0.76;
  const ITEM_HEIGHT = ITEM_WIDTH * 1.7;

  const {
    data,
    error,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery('savedMediaList', tmdbServices.getInfinityList, {
    getNextPageParam: pageParams => pageParams.next,
  });

  useEffect(() => {
    const isFetchNextData =
      index === mediaData.length - VISIBLE_ITEMS && hasNextPage;
    if (isFetchNextData) fetchNextPage();
  }, [index, mediaData, hasNextPage]);

  useEffect(() => {
    setMediaData([]);
    const arr = [];
    const mediaIds = new Set();

    data?.pages.forEach((page, index) => {
      page.data.results.forEach(media => {
        if (!mediaIds.has(media.id)) {
          mediaIds.add(media.id);
          arr.push(media);
        }
      });

      if (index === data.pages.length - 1) setMediaData(arr);
    });
  }, [data]);

  useEffect(() => {
    isError &&
      dispatch(actionsCommon.setError(error?.response?.data.status_message));
  }, [isError]);

  //   console.log(mediaData);

  const renderItem = useCallback(
    ({item, index}) => {
      const inputRange = [index - 1, index, index + 1];

      const translateX = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [45, 0, -100],
      });

      const scale = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [0.8, 1, 1.3],
      });

      const opacity = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [1 - 1 / VISIBLE_ITEMS, 1, 0],
      });

      return (
        <Animated.View
          style={[
            styles.imageBlock,
            {
              left: -ITEM_WIDTH / 2,
              opacity,
              transform: [{translateX}, {scale}],
            },
          ]}>
          <FastImage
            style={styles.image}
            source={{
              uri: item.poster_path
                ? `${BASE_IMAGE_URL}w500${item.poster_path}`
                : DEFAULT_MOVIE_IMAGE,
            }}
            style={[{width: ITEM_WIDTH, height: ITEM_HEIGHT}]}></FastImage>
        </Animated.View>
      );
    },
    [width],
  );

  const cellRendererComponent = useCallback(
    ({item, index, children, style, ...props}) => {
      const zIndex = mediaData.length - index;
      const newStyle = [style, {zIndex, elevation: zIndex}];

      return (
        <View style={newStyle} index={index} {...props}>
          {children}
        </View>
      );
    },
    [mediaData],
  );

  const setActiveIndex = useCallback(activeIndex => {
    setIndex(activeIndex);
    scrollXIndex.setValue(activeIndex);
  }, []);

  const isShowLoader = useMemo(
    () => isLoading || Platform.select({ios: isFetching, android: isFetching}),
    [isLoading, isFetching],
  );

  return (
    <>
      {isShowLoader && <Loader />}

      <FlingGestureHandler
        key="left"
        direction={Directions.LEFT}
        onHandlerStateChange={e => {
          if (e.nativeEvent.state === State.END) {
            if (index === mediaData.length - 1) return;
            setActiveIndex(index + 1);
          }
        }}>
        <FlingGestureHandler
          key="right"
          direction={Directions.RIGHT}
          onHandlerStateChange={e => {
            if (e.nativeEvent.state === State.END) {
              if (index === 0) return;
              setActiveIndex(index - 1);
            }
          }}>
          <SafeAreaView style={styles.container}>
            <OverflowItems data={mediaData} scrollXAnimated={scrollXAnimated} />

            <Animated.FlatList
              data={mediaData}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              CellRendererComponent={cellRendererComponent}
              horizontal
              inverted
              scrollEnabled={false}
              removeClippedSubviews={false}
              contentContainerStyle={styles.flatListContainer}
            />
          </SafeAreaView>
        </FlingGestureHandler>
      </FlingGestureHandler>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  flatListContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING * 2,
  },

  imageBlock: {
    position: 'absolute',
  },

  image: {
    padding: 20,
    paddingTop: 50,
  },
});
