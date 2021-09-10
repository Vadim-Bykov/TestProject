import React from 'react';
import {StyleSheet, Switch, View, Text} from 'react-native';
import {colors} from 'react-native-elements';
import {ThemeText} from '../../../common/ThemeText';

export const ModeSwitch = ({isTrending, toggleMode}) => {
  return (
    <View style={styles.toggleContainer}>
      <ThemeText>Trending</ThemeText>
      <Switch
        style={styles.switch}
        value={isTrending}
        onValueChange={toggleMode}
        trackColor={{false: colors.primary, true: colors.primary}}
        ios_backgroundColor={colors.primary}
        thumbColor={colors.warning}
      />
      <ThemeText>By genre</ThemeText>
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
