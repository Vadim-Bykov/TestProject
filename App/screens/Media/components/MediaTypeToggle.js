import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import {colors} from 'react-native-elements';

export const MediaTypeToggle = ({mediaType, toggleMediaType}) => {
  return (
    <View style={styles.toggleContainer}>
      <Text>Movies</Text>
      <Switch
        style={styles.switch}
        value={mediaType === 'tv'}
        onValueChange={toggleMediaType}
        trackColor={{false: colors.primary, true: colors.primary}}
        ios_backgroundColor={colors.primary}
        thumbColor={colors.warning}
      />
      <Text>TV</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },

  switch: {
    marginHorizontal: 5,
  },
});
