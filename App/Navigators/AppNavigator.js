import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useLayoutEffect} from 'react';
import {useColorScheme} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {navigationRef} from '../common/RootNavigation';
import {COLORS_DARK_THEME, COLORS_LIGHT_THEME} from '../consts/consts';
import * as actionsCommon from '../store/common/actions';
import * as selectorsCommon from '../store/common/selectors';
import {MainStackNavigator} from './MainStackNavigator';

export const AppNavigator = () => {
  const theme = useColorScheme();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(actionsCommon.setColorScheme(theme));
  }, []);

  const colorScheme = useSelector(selectorsCommon.getColorScheme);

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === 'light' ? COLORS_LIGHT_THEME : COLORS_DARK_THEME}>
      <MainStackNavigator />
    </NavigationContainer>
  );
};
