import MaskedView from '@react-native-community/masked-view';
import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Animated} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Rect} from 'react-native-svg';
import {BASE_IMAGE_URL, DEFAULT_MOVIE_IMAGE} from '../../../consts/consts';
import * as utils from '../../../utils/utils';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export const AnimatedBackdropIOS = ({mediaData, scrollX}) => {
  const {ITEM_WIDTH, width, height} = utils.getHomePagerDimensions();

  const {colors} = useTheme();

  return (
    <>
      {mediaData?.map((item, index) => {
        const translateX = scrollX.interpolate({
          inputRange: [(index - 1) * ITEM_WIDTH, ITEM_WIDTH * index],
          outputRange: [-width, 0],
        });

        return (
          <MaskedView
            key={`mask${item.id}`}
            style={styles.maskedContainer}
            maskElement={
              <AnimatedSvg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                style={{transform: [{translateX}]}}>
                <Rect x={0} y={0} height={height} width={width} fill="blue" />
              </AnimatedSvg>
            }>
            <FastImage
              source={{
                uri: item.backdrop_path
                  ? `${BASE_IMAGE_URL}w1280${item.backdrop_path}`
                  : DEFAULT_MOVIE_IMAGE,
              }}
              style={{width, height}}
            />
          </MaskedView>
        );
      })}

      <LinearGradient
        colors={['transparent', colors.background]}
        style={styles.maskedContainer}
      />
    </>
  );
};

const styles = StyleSheet.create({
  maskedContainer: {
    position: 'absolute',
    ...StyleSheet.absoluteFill,
  },
});
