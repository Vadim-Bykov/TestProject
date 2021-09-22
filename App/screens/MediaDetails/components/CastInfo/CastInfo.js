import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Animated, StyleSheet, View, Text, Easing} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import * as tmdbService from '../../../../api/tmdbService';
import {Loader} from '../../../../common/Loader';
import {ThemeText} from '../../../../common/ThemeText';
import * as actionsCommon from '../../../../store/common/actions';
import {SPACE} from '../../MediaDetailsScreen';
import {CastInfoItem} from './CastInfoItem';

export const CastInfo = React.memo(({id, mediaType, width}) => {
  const dispatch = useDispatch();
  const scroll = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-width * 2)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 900,
      delay: 500,
      // easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  });

  const translateX = translateY.interpolate({
    inputRange: [-width * 2, 0],
    outputRange: [-width, 0],
  });

  const {data, error, isLoading, isError} = useQuery(
    ['castInfo', id, mediaType],
    () => tmdbService.getCastInfo({mediaId: id, mediaType}),
  );

  useEffect(() => {
    isError &&
      dispatch(actionsCommon.setError(error.response.data.status_message));
  }, [isError]);

  const FLAT_LIST_WINDOW_WIDTH = width - SPACE * 2;

  const ITEM_WIDTH = useMemo(() => FLAT_LIST_WINDOW_WIDTH / 5, []);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <CastInfoItem
          index={index}
          profilePath={item.profile_path}
          profileName={item.name}
          scroll={scroll}
          FLAT_LIST_WINDOW_WIDTH={FLAT_LIST_WINDOW_WIDTH}
          ITEM_WIDTH={ITEM_WIDTH}
        />
      );
    },
    [FLAT_LIST_WINDOW_WIDTH],
  );

  const getItemLayout = useCallback(
    (_, index) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [ITEM_WIDTH],
  );

  const onScroll = useMemo(() => {
    return Animated.event([{nativeEvent: {contentOffset: {x: scroll}}}], {
      useNativeDriver: true,
    });
  }, []);

  return (
    <Animated.View
      style={[styles.container, {transform: [{translateY}, {translateX}]}]}>
      {isLoading && <Loader />}
      <ThemeText style={styles.title}>Cast & Crew</ThemeText>
      <Animated.FlatList
        data={data?.cast}
        horizontal
        keyExtractor={item => item.credit_id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        decelerationRate="normal"
      />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: SPACE,
  },

  title: {
    fontSize: 20,
  },
});
