import React, {useCallback} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as actionsMedia from '../../../store/media/actions';
import * as selectorsMedia from '../../../store/media/selectors';
import {Genre} from './Genre';

export const Genres = React.memo(({genres, mode}) => {
  const activeGenre = useSelector(selectorsMedia.getActiveGenre);
  const dispatch = useDispatch();

  const onSetGenre = useCallback(genreId => {
    dispatch(actionsMedia.setActiveGenre(genreId));
    dispatch(actionsMedia.setPage(1));
  }, []);

  const renderItem = useCallback(
    ({item}) => (
      <Genre
        genre={item}
        isActive={activeGenre === item.id}
        onSetGenre={onSetGenre}
        mode={mode}
      />
    ),
    [activeGenre, mode],
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
});
