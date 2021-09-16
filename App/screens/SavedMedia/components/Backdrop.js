import MaskedView from '@react-native-community/masked-view';
import React, {useCallback} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {BackdropItem} from './BackdropItem';

export const Backdrop = ({mediaData, width, height, scrollX, itemWidth}) => {
  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <BackdropItem
          index={index}
          item={item}
          width={width}
          height={height}
          itemWidth={itemWidth}
          scrollX={scrollX}
        />
      );
    },
    [width, mediaData],
  );

  return (
    <View style={[styles.container]}>
      <FlatList
        data={mediaData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        horizontal
        contentContainerStyle={styles.flatListContainer}
        initialNumToRender={1000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    ...StyleSheet.absoluteFill,
  },

  flatListContainer: {
    // flexGrow: 1,
    // borderWidth: StyleSheet.hairlineWidth,
    // borderColor: 'transparent',
  },
});
