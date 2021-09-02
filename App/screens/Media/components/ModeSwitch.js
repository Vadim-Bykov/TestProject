import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import {colors} from 'react-native-elements';

export const ModeSwitch = ({isTrending, toggleMode}) => {
  return (
    <View style={styles.toggleContainer}>
      <Text>Trending</Text>
      <Switch
        style={styles.switch}
        value={isTrending}
        onValueChange={toggleMode}
        trackColor={{false: colors.primary, true: colors.primary}}
        ios_backgroundColor={colors.primary}
        thumbColor={colors.warning}
      />
      <Text>By genre</Text>
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
