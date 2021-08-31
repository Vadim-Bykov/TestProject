import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {MainStackNavigator} from './MainStackNavigator';
import {TabNavigator} from './TabNavigator';

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  );
};
