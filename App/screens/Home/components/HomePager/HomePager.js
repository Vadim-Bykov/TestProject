import React, {useCallback, useRef, useLayoutEffect} from 'react';
import {
  useWindowDimensions,
  RefreshControl,
  Animated,
  Platform,
} from 'react-native';
import {HomePagerItem} from './HomePagerItem';
import {OverflowHomeTitle} from '../OverflowHomeTitle';
import * as utils from '../../../../utils/utils';

// const SPACING = 10;

export const HomePager = ({data, goToDetails, isFetching, scrollX}) => {
  const flatListRef = useRef(null);

  useLayoutEffect(() => {
    data?.results &&
      flatListRef?.current?.scrollToIndex({index: 0, animated: false});
  }, [data?.results]);

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
