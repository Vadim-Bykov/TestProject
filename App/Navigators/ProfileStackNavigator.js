import React from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {ProfileScreen} from '../screens/Profile/ProfileScreen';
import {EditProfileScreen} from '../screens/Profile/EditProfileScreen';
import {STACK_SCREEN_OPTIONS} from '../consts/consts';

const Stack = createStackNavigator();

export const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{...STACK_SCREEN_OPTIONS}}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};
