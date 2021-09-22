import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {MediaScreen} from '../screens/Media/MediaScreen';
import {MediaDetailsScreen} from '../screens/MediaDetails/MediaDetailsScreen';
import {colors, Icon} from 'react-native-elements';
import {STACK_SCREEN_OPTIONS} from '../consts/consts';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {HomeScreen} from '../screens/Home/HomeScreen';

const Stack = createStackNavigator();
// const Stack = createSharedElementStackNavigator();

export const MediaStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...STACK_SCREEN_OPTIONS,
        headerTransparent: true,
        // // headerBackground: () => null,
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
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="Movies" component={MediaScreen} />

      <Stack.Screen
        name="Details"
        component={MediaDetailsScreen}
        // sharedElements={route => [route.params.id.toString()]}
      />
    </Stack.Navigator>
  );
};
