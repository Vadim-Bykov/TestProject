import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const EmptyList = ({itemName}) => {
  return (
    <View style={styles.container}>
      <Text>You have no saved {itemName}. Please add one.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});
