import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {Loader} from '../../common/Loader';

export const SplashScreen = () => (
  <ImageBackground
    style={styles.container}
    source={require('../../assets/images/cityStart.jpg')}>
    <Loader />
  </ImageBackground>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
