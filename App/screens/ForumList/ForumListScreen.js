import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, StyleSheet, useWindowDimensions} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import * as firebaseService from '../../api/firebaseService';
import * as actionsCommon from '../../store/common/actions';
import * as utils from '../../utils/utils';
import {ForumListItem} from './components/ForumListItem';
import {useTheme} from '@react-navigation/native';

export const SPACING = 5;

export const ForumListScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [forums, setForums] = useState([]);
  const {width, height} = useWindowDimensions();
  const {colors} = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const {bottom, top} = useSafeAreaInsets();

  const WINDOW_LIST_HEIGHT = height - bottom - top - 50;
  const ITEMS_COUNT = Math.round(WINDOW_LIST_HEIGHT / 80);
  const ITEM_HEIGHT = Math.floor(WINDOW_LIST_HEIGHT / ITEMS_COUNT);

  const goToForum = useCallback((docId, title) => {
    navigation.navigate('Forum', {docId, title});
  }, []);

  const onResult = useCallback(querySnapshot => {
    const tempStore = [];
    if (querySnapshot.empty) return;

    querySnapshot.docs.forEach(document => tempStore.push(document.data()));
    setForums(tempStore);
  }, []);

  const onError = useCallback(error => {
    dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
  }, []);

  useEffect(() => {
    const subscriber = firebaseService.observeCollection(
      'forums',
      onResult,
      onError,
    );

    return subscriber;
  }, []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <ForumListItem
          item={item}
          index={index}
          width={width}
          themeColors={colors}
          scrollY={scrollY}
          WINDOW_LIST_HEIGHT={WINDOW_LIST_HEIGHT}
          ITEM_HEIGHT={ITEM_HEIGHT}
          goToForum={goToForum}
        />
      );
    },
    [width, colors, WINDOW_LIST_HEIGHT, ITEM_HEIGHT],
  );

  console.log(forums);

  const onScroll = useMemo(
    () =>
      Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
        useNativeDriver: true,
      }),
    [scrollY],
  );

  return (
    <SafeAreaView style={[styles.container, {marginBottom: -bottom}]}>
      <Animated.FlatList
        data={forums}
        keyExtractor={item => `forum${item.documentId}`}
        renderItem={renderItem}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate={'fast'}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        bounces={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING,
  },
});
