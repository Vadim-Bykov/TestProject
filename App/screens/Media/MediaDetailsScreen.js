import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export const MediaDetailsScreen = () => {
  return (
    //  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <Text>Details</Text>
    </ScrollView>
    //  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },

  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    //  backgroundColor: 'green',
    justifyContent: 'center',
  },
});
