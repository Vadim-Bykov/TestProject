import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {navigationRef} from '../common/RootNavigation';
import {MainStackNavigator} from './MainStackNavigator';

export const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <MainStackNavigator />
    </NavigationContainer>
  );
};
