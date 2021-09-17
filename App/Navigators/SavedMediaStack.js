import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {STACK_SCREEN_OPTIONS} from '../consts/consts';
import {SavedMediaScreen} from '../screens/SavedMedia/SavedMediaScreen';
import {MediaDetailsScreen} from '../screens/MediaDetails/MediaDetailsScreen';
import {colors, Icon} from 'react-native-elements';

const Stack = createStackNavigator();

export const SavedMediaStack = () => {
  return (
    <Stack.Navigator screenOptions={{...STACK_SCREEN_OPTIONS}}>
      <Stack.Screen
        name="Saved"
        component={SavedMediaScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SavedDetails"
        component={MediaDetailsScreen}
        options={{
          headerTransparent: true,
          // headerBackground: () => null,
          headerBackTitleVisible: false,
          headerTitle: '',
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
        }}
      />
    </Stack.Navigator>
  );
};
