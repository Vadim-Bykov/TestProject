import React, {useCallback, useRef, useLayoutEffect} from 'react';
import {
  useWindowDimensions,
  RefreshControl,
  Animated,
  Platform,
} from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HomePagerItem} from './HomePagerItem';
import {OverflowHomeTitle} from '../OverflowHomeTitle';
import * as utils from '../../../../utils/utils';

// const SPACING = 10;

export const HomePager = ({data, goToDetails, isFetching, scrollX}) => {
  const flatListRef = useRef(null);
  // const {width, height} = useWindowDimensions();
  // const {top, left, right} = useSafeAreaInsets();
  // const scrollX = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    data?.results &&
      flatListRef?.current?.scrollToIndex({index: 0, animated: false});
  }, [data?.results]);

  // const isLandScape = width > height;

  // const FLAT_LIST_WINDOW_WIDTH = width - SPACING * 2 - left - right;
  // const PORTRAIT_SLIDES_COUNT = 1;
  // const ITEM_HEIGHT = isLandScape
  //   ? height - top - 60 - SPACING * 2 // 60 - bottomTabNavigator height
  //   : (FLAT_LIST_WINDOW_WIDTH / PORTRAIT_SLIDES_COUNT) * 1.35;
  // const LANDSCAPE_SLIDES_COUNT = Math.floor(
  //   (FLAT_LIST_WINDOW_WIDTH / ITEM_HEIGHT) * 1.5,
  // );
  // // const LANDSCAPE_SLIDES_COUNT = 3;

  // const SHOWN_SLIDES_COUNT = isLandScape
  //   ? LANDSCAPE_SLIDES_COUNT
  //   : PORTRAIT_SLIDES_COUNT;
  // const ITEM_WIDTH = Math.floor(FLAT_LIST_WINDOW_WIDTH / SHOWN_SLIDES_COUNT);
  // // const SIDE_SPACER_WIDTH =
  // //   (FLAT_LIST_WINDOW_WIDTH -
  // //     (isLandScape ? ITEM_WIDTH * SHOWN_SLIDES_COUNT : ITEM_WIDTH)) /
  // //   2;

  const {FLAT_LIST_WINDOW_WIDTH, ITEM_HEIGHT, ITEM_WIDTH, width, isLandScape} =
    utils.getHomePagerDimensions();

  const renderItem = useCallback(
    ({item, index}) => {
      // if (!item.poster_path)
      //   return (
      //     <View
      //       style={{
      //         width: SIDE_SPACER_WIDTH,
      //         height: 100,
      //         backgroundColor: 'blue',
      //       }}
      //     />
      //   );

      return (
        <HomePagerItem
          item={item}
          // index={index - 1}
          index={index}
          ITEM_WIDTH={ITEM_WIDTH}
          ITEM_HEIGHT={ITEM_HEIGHT}
          FLAT_LIST_WINDOW_WIDTH={FLAT_LIST_WINDOW_WIDTH}
          scrollX={scrollX}
          goToDetails={goToDetails}
        />
      );
    },
    [width, FLAT_LIST_WINDOW_WIDTH, ITEM_WIDTH, ITEM_HEIGHT],
  );

  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [width],
  );

  // console.log(data);

  return (
    <>
      {!isLandScape && data && (
        <OverflowHomeTitle
          mediaData={data?.results}
          scrollX={scrollX}
          ITEM_WIDTH={ITEM_WIDTH}
        />
      )}

      <Animated.FlatList
        // data={data && [{id: 'spacerLeft'}, ...data?.results, {id: 'spacerRight'}]}
        ref={flatListRef}
        data={data?.results}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces={false}
        getItemLayout={getItemLayout}
        snapToInterval={ITEM_WIDTH}
        decelerationRate={0.84}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: true,
          },
        )}
        refreshControl={
          <RefreshControl
            refreshing={Platform.OS === 'android' && isFetching}
          />
        }
      />
    </>
  );
};
