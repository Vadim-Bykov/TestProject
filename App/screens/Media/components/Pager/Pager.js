import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useWindowDimensions, Animated} from 'react-native';
import {useSelector} from 'react-redux';
import * as selectorsMedia from '../../../../store/media/selectors';
import {OverflowTitles} from './OverflowTitles';
import {Slide} from './Slide';

export const Pager = React.memo(({mediaType, goToDetails}) => {
  const {width} = useWindowDimensions();
  const mediaDate = useSelector(selectorsMedia.getMediaData);
  // const [activeIndex, setActiveIndex] = useState(0);

  const scroll = useRef(new Animated.Value(0)).current;

  const itemWidth = useMemo(() => Math.ceil(width * 0.8), [width]);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <Slide
          id={item.id}
          posterPath={item.poster_path}
          title={mediaType === 'movie' ? item.title : item.original_name}
          voteAverage={item.vote_average}
          width={width}
          index={index}
          lastIndex={mediaDate.length - 1}
          scroll={scroll}
          itemWidth={itemWidth}
          goToDetails={goToDetails}
          mediaType={mediaType}
        />
      );
    },
    [width, mediaDate, mediaType, scroll, itemWidth],
  );

  const getItemLayout = useCallback(
    (_, index) => ({
      length: itemWidth,
      offset: itemWidth * index,
      index,
    }),
    [itemWidth],
  );

  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef && mediaDate?.length) {
      flatListRef.current.scrollToIndex({
        animated: false,
        index: 0,
      });
    }
  }, [flatListRef, mediaDate]);

  // const onViewableItemsChanged = useCallback(({viewableItems}) => {
  //   const index = viewableItems.length ? viewableItems[0].index : -1;
  //   setActiveIndex(index);
  // }, []);

  return (
    <>
      {mediaDate && (
        <OverflowTitles
          mediaDate={mediaDate}
          scroll={scroll}
          itemWidth={itemWidth}
        />
      )}

      <Animated.FlatList
        ref={flatListRef}
        data={mediaDate}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        // pagingEnabled
        // disableIntervalMomentum
        snapToInterval={itemWidth}
        decelerationRate={0.88}
        // viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        // onViewableItemsChanged={onViewableItemsChanged}
        // extraData={activeIndex}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scroll,
                },
              },
            },
          ],
          {useNativeDriver: true},
        )}
      />
    </>
  );
});
