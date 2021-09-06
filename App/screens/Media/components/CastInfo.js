import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Animated, FlatList, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import * as tmdbService from '../../../api/tmdbService';
import {Loader} from '../../../common/Loader';
import {BASE_IMAGE_URL, DEFAULT_AVATAR} from '../../../consts/consts';
import * as actionsCommon from '../../../store/common/actions';
import {SPACE} from '../MediaDetailsScreen';

export const CastInfo = ({id, mediaType, width}) => {
  const dispatch = useDispatch();
  const scroll = useRef(new Animated.Value(0)).current;

  const {data, error, isLoading, isError} = useQuery(
    ['castInfo', id, mediaType],
    () => tmdbService.getCastInfo({mediaId: id, mediaType}),
  );

  useEffect(() => {
    isError &&
      dispatch(actionsCommon.setError(error.response.data.status_message));
  }, [isError]);

  const ITEM_WIDTH = useMemo(() => width / 4, []);

  const renderItem = useCallback(({item, index}) => {
    const position = Animated.subtract(index * ITEM_WIDTH, scroll);

    const isDisappearing = -ITEM_WIDTH;
    const isLeft = 0;
    const isRight = width - ITEM_WIDTH;
    const isAppearing = width;

    //  const scale = scroll.interpolate({
    //    inputRange: [
    //      -ITEM_WIDTH,
    //      0,
    //      ITEM_WIDTH * (index === 0 ? index : index - 1),
    //      ITEM_WIDTH * index,
    //      ITEM_WIDTH * (index + 1),
    //    ],
    //    outputRange: [1, index === 1 ? 0.8 : 1, 1, 1, 0.6],
    //  });

    const scale = position.interpolate({
      inputRange: [isDisappearing, isLeft, isRight, isAppearing],
      outputRange: [0, 1, 1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.itemContainer,
          {
            width: ITEM_WIDTH,
            transform: [{scale}],
          },
        ]}>
        <FastImage
          source={{
            uri: item.profile_path
              ? `${BASE_IMAGE_URL}/w300/${item.profile_path}`
              : DEFAULT_AVATAR,
          }}
          style={[
            styles.photo,
            {
              width: ITEM_WIDTH * 0.8,
              height: ITEM_WIDTH * 0.8,
              borderRadius: (ITEM_WIDTH * 0.8) / 2,
            },
          ]}
        />
        <Text style={styles.name}>{item.name}</Text>
      </Animated.View>
    );
  }, []);

  console.log(data?.cast);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [ITEM_WIDTH],
  );

  return (
    <View style={styles.container}>
      {isLoading && <Loader />}
      <Animated.FlatList
        data={data?.cast}
        horizontal
        keyExtractor={item => item.cast_id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scroll}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: SPACE,
  },

  itemContainer: {
    alignItems: 'center',
  },

  photo: {},

  name: {
    textAlign: 'center',
  },
});
