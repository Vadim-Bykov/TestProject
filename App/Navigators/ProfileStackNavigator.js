import React from 'react';
import {View, Text, Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {ProfileScreen} from '../screens/Profile/ProfileScreen';
import {EditProfileScreen} from '../screens/Profile/EditProfileScreen';
import {STACK_SCREEN_OPTIONS} from '../consts/consts';
import {colors, Icon} from 'react-native-elements';

const Stack = createStackNavigator();

export const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{...STACK_SCREEN_OPTIONS, headerBackTitleVisible: false}}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerBackImage: () => (
            <Icon
              type="ionicon"
              name="ios-chevron-back"
              size={Platform.select({
                ios: 32,
                android: 24,
              })}
              color={Platform.select({
                ios: colors.platform.ios.primary,
                android: colors.black,
              })}
            />
          ),
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};
