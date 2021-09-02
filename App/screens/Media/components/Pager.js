import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Animated,
} from 'react-native';
import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {
  BASE_IMAGE_URL,
  colors,
  DEFAULT_MOVIE_IMAGE,
} from '../../../consts/consts';

export const Pager = ({mediaDate, mediaType}) => {
  const {width} = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = useRef(new Animated.Value(0)).current;

  const Slide = React.memo(
    ({
      posterPath,
      title,
      voteAverage,
      width,
      index,
      lastIndex,
      activeIndex,
    }) => {
      console.log('index', index, index === activeIndex);
      return (
        <View
          style={[
            styles.slideContainer,
            {
              width: width * 0.8,
              marginLeft: index === 0 ? width * 0.1 : 0,
              marginRight: index === lastIndex ? width * 0.1 : 0,
              shadowColor: index === activeIndex ? colors.BLACK : 'transparent',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.32,
              shadowRadius: 5.46,
            },
          ]}>
          <FastImage
            source={{
              uri: posterPath
                ? `${BASE_IMAGE_URL}w500${posterPath}`
                : DEFAULT_MOVIE_IMAGE,
            }}
            style={[
              styles.image,
              {
                width: width * 0.75,
                height: width,
                elevation: index === activeIndex ? 10 : 0,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.infoBlock,
              {
                opacity: scroll.interpolate({
                  inputRange: [index, index * width * 0.8 + width * 0.8 - 200],
                  outputRange: [
                    index === activeIndex ? 1 : 0,
                    index === activeIndex ? 0 : 1,
                  ],
                }),
              },
            ]}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.voteAverageBlock}>
              <Icon name="star" color="gold" />
              <Text>{voteAverage}</Text>
            </View>
          </Animated.View>
        </View>
      );
    },
  );

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <Slide
          posterPath={item.poster_path}
          title={mediaType === 'movie' ? item.title : item.original_name}
          voteAverage={item.vote_average}
          width={width}
          index={index}
          lastIndex={mediaDate.length - 1}
          activeIndex={activeIndex}
        />
      );
    },
    [width, mediaDate, activeIndex, mediaType],
  );

  const ITEM_WIDTH = useMemo(() => Math.ceil(width * 0.8), [width]);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [ITEM_WIDTH],
  );

  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    const index = viewableItems.length ? viewableItems[0].index : -1;
    setActiveIndex(index);
  }, []);

  return (
    <Animated.FlatList
      data={mediaDate}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      getItemLayout={getItemLayout}
      // pagingEnabled
      disableIntervalMomentum
      snapToInterval={ITEM_WIDTH}
      decelerationRate="normal"
      // viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
      // onViewableItemsChanged={onViewableItemsChanged}
      extraData={activeIndex}
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
  );
};

const styles = StyleSheet.create({
  slideContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },

  infoBlock: {
    alignItems: 'center',
  },

  image: {
    borderRadius: 20,
  },

  title: {
    alignSelf: 'center',
    marginTop: 10,
  },

  voteAverageBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
