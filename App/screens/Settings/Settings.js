import {useTheme} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {ThemeText} from '../../common/ThemeText';
import * as actionsCommon from '../../store/common/actions';

export const Settings = () => {
  const dispatch = useDispatch();
  const {dark, colors} = useTheme();

  const toggleTheme = useCallback(() => {
    dispatch(actionsCommon.setColorScheme(dark ? 'light' : 'dark'));
  }, [dark]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toggleThemeBlock}>
        <ThemeText>Light theme</ThemeText>
        <Switch
          value={dark ? true : false}
          onValueChange={toggleTheme}
          trackColor={{false: 'yellow', true: 'purple'}}
          ios_backgroundColor="yellow"
          thumbColor={dark ? 'yellow' : 'purple'}
          style={styles.toggle}
        />
        <ThemeText>Dark theme</ThemeText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },

  toggle: {
    marginHorizontal: 15,
  },

  toggleThemeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
