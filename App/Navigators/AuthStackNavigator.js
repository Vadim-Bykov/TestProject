import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SignInScreen} from '../screens/Auth/SignInScreen';
import {SignUpScreen} from '../screens/Auth/SignUpScreen';
import {STACK_SCREEN_OPTIONS} from '../consts/consts';

const Stack = createStackNavigator();

export const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...STACK_SCREEN_OPTIONS,
      }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};
