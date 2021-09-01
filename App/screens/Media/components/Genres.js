import React, {useCallback, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../../../consts/consts';
import * as actionsMedia from '../../../store/media/actions';
import * as selectorsMedia from '../../../store/media/selectors';

const Genre = ({genre, isActive, onSetGenre}) => {
  const onPress = useCallback(() => {
    onSetGenre(genre.id);
  }, []);

  const scale = useRef(new Animated.Value(0)).current;

  Animated.spring(scale, {
    toValue: isActive ? 1 : 0,
    useNativeDriver: true,
  }).start();

  //   const backgroundColor = scale.interpolate({
  //     inputRange: [0, 1],
  //     outputRange: ['transparent', '#20BBF6'],
  //   });

  return (
    <TouchableOpacity
      style={styles.genreContainer}
      activeOpacity={0.6}
      onPress={onPress}>
      <Animated.View style={[styles.genreBlock]}>
        <Text>{genre.name}</Text>
      </Animated.View>
      <Animated.View style={[styles.dash, {transform: [{scale}]}]} />
    </TouchableOpacity>
  );
};

export const Genres = React.memo(({genres}) => {
  const activeGenre = useSelector(selectorsMedia.getActiveGenre);
  const dispatch = useDispatch();

  const onSetGenre = useCallback(genreId => {
    dispatch(actionsMedia.setActiveGenre(genreId));
  }, []);

  const renderItem = useCallback(
    ({item}) => (
      <Genre
        genre={item}
        isActive={activeGenre === item.id}
        onSetGenre={onSetGenre}
      />
    ),
    [activeGenre],
  );

  return (
    <FlatList
      data={genres}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.flatListContainer}
      extraData={activeGenre}
    />
  );
});

const styles = StyleSheet.create({
  flatListContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },

  genreContainer: {
    marginHorizontal: 5,
    justifyContent: 'space-between',
  },

  genreBlock: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.BLACK,
    //  backgroundColor: 'blue',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  },

  dash: {
    borderBottomColor: colors.BLUE,
    borderBottomWidth: 3,
    marginLeft: 5,
    width: '60%',
  },
});
