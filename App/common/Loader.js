import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {colors} from '../consts/consts';

export const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00ff00" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    ...StyleSheet.absoluteFill,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.BG_TRANSPARENT_GRAY,
    zIndex: 100,
  },
});
