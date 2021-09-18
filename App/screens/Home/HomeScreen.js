import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  useWindowDimensions,
  FlatList,
  Animated,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import * as actionsCommon from '../../store/common/actions';
import {Button, Avatar} from 'react-native-elements';
import * as firebaseService from '../../api/firebaseService';
import {useDispatch, useSelector} from 'react-redux';
import * as selectorsAuth from '../../store/auth/selectors';
import * as selectorsCommon from '../../store/common/selectors';
import {Loader} from '../../common/Loader';
import {ThemeText} from '../../common/ThemeText';
import {useTheme} from '@react-navigation/native';
import {useQuery} from 'react-query';
import * as tmdbService from '../../api/tmdbService';
import {extractErrorMessage} from '../../utils/utils';
import {HomeMediaItem} from './components/HomeMediaItem';

const SPACING = 10;

export const HomeScreen = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [mediaType, setMediaType] = useState('movie');
  const {colors} = useTheme();
  const {width, height} = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const isLandScape = width > height;

  const {data, error, isError, isLoading, isFetching} = useQuery(
    ['movieData', page],
    () => tmdbService.getMovies({mediaType, page, timeWindow: 'week'}),
  );

  useEffect(() => {
    isError && dispatch(actionsCommon.setError(extractErrorMessage(error)));
  }, [isError]);

  const FLAT_LIST_WINDOW_WIDTH = width - SPACING * 2;
  const PORTRAIT_SLIDES_COUNT = 1;
  const ITEM_HEIGHT = isLandScape
    ? height - insets.top - 60 - SPACING * 2 // 60 - bottomTabNavigator height
    : (FLAT_LIST_WINDOW_WIDTH / PORTRAIT_SLIDES_COUNT) * 1.35;
  const LANDSCAPE_SLIDES_COUNT = Math.floor(
    (FLAT_LIST_WINDOW_WIDTH / ITEM_HEIGHT) * 1.5,
  );
  // const LANDSCAPE_SLIDES_COUNT = 4;

  const SHOWN_SLIDES_COUNT = isLandScape
    ? LANDSCAPE_SLIDES_COUNT
    : PORTRAIT_SLIDES_COUNT;
  const ITEM_WIDTH = Math.floor(FLAT_LIST_WINDOW_WIDTH / SHOWN_SLIDES_COUNT);
  // const SIDE_SPACER_WIDTH =
  //   (FLAT_LIST_WINDOW_WIDTH -
  //     (isLandScape ? ITEM_WIDTH * SHOWN_SLIDES_COUNT : ITEM_WIDTH)) /
  //   2;

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
        <HomeMediaItem
          item={item}
          // index={index - 1}
          index={index}
          ITEM_WIDTH={ITEM_WIDTH}
          ITEM_HEIGHT={ITEM_HEIGHT}
          FLAT_LIST_WINDOW_WIDTH={FLAT_LIST_WINDOW_WIDTH}
          scrollX={scrollX}
        />
      );
    },
    [width],
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
      {(isFetching || isLoading) && <Loader />}

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}>
          <Animated.FlatList
            // data={data && [{id: 'spacerLeft'}, ...data?.results, {id: 'spacerRight'}]}
            data={data?.results}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            getItemLayout={getItemLayout}
            snapToInterval={ITEM_WIDTH}
            decelerationRate={0.84}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: true},
            )}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
  },

  scrollViewContainer: {
    flex: 1,
    // backgroundColor: 'orange',
    padding: SPACING,
  },
});
