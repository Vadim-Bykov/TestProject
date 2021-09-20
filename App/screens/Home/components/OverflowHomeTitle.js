import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, Animated} from 'react-native';
import * as utils from '../../../utils/utils';
import {useAnimatedTitle} from '../hooks/useAnimatedTitle';

export const TITLE_HEIGHT = 30;

export const OverflowHomeTitle = ({medias, scrollX, ITEM_WIDTH}) => {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      {medias.map((media, index) => {
        const {translateY, scale, rotateX} = useAnimatedTitle({
          scrollX,
          ITEM_WIDTH,
          index,
        });

        return (
          <Animated.Text
            key={media.title}
            style={[
              styles.titleContainer,
              {
                transform: [
                  {translateY},
                  {scale},
                  {rotateX},
                  {perspective: 1000},
                ],
                color: colors.text,
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

  titleContainer: {
    height: TITLE_HEIGHT,
    justifyContent: 'center',
    fontSize: 25,
    textTransform: 'uppercase',
  },
});
