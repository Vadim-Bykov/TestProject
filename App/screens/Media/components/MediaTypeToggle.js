import React from 'react';
import {StyleSheet, Switch, View, Text} from 'react-native';
import {colors} from 'react-native-elements';
import {ThemeText} from '../../../common/ThemeText';

export const MediaTypeToggle = ({mediaType, toggleMediaType}) => {
  return (
    <View style={styles.toggleContainer}>
      <ThemeText>Movies</ThemeText>
      <Switch
        style={styles.switch}
        value={mediaType === 'tv'}
        onValueChange={toggleMediaType}
        trackColor={{false: colors.primary, true: colors.primary}}
        ios_backgroundColor={colors.primary}
        thumbColor={colors.warning}
      />
      <ThemeText>TV</ThemeText>
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
