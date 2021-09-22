import React from 'react';
import {StyleSheet, View, Animated} from 'react-native';
import {COLORS} from '../../../consts/consts';
import * as utils from '../../../utils/utils';
import {useAnimatedTitle} from '../hooks/useAnimatedTitle';

export const TITLE_HEIGHT = 30;

export const OverflowHomeTitle = ({mediaData, scrollX, ITEM_WIDTH}) => {
  return (
    <View style={styles.container}>
      {mediaData.map((media, index) => {
        const {translateY, scale, rotateX} = useAnimatedTitle({
          scrollX,
          ITEM_WIDTH,
          index,
        });

        return (
          <Animated.Text
            key={media.title}
            style={[
              styles.title,
              {
                transform: [
                  {translateY},
                  {scale},
                  {rotateX},
                  {perspective: 1000},
                ],
              },
            ]}>
            {utils.cutStringToSize(media.title, 20)}
          </Animated.Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: TITLE_HEIGHT,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 10,
  },

  title: {
    height: TITLE_HEIGHT,
    justifyContent: 'center',
    fontSize: 25,
    textTransform: 'uppercase',
    color: COLORS.WHITE,
    textShadowColor: COLORS.BLACK,
    textShadowRadius: 3,
    textShadowOffset: {height: 2, width: 2},
  },
});
