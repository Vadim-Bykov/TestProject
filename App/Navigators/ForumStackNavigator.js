import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import {View, Text} from 'react-native';
import {ForumScreen} from '../screens/Forum/ForumScreen';
import {ForumListScreen} from '../screens/ForumList/ForumListScreen';

const Stack = createStackNavigator();

export const ForumStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        transitionSpec: {open: 'spring', close: 'spring'},
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        gestureEnabled: true,
        gestureDirection: 'vertical',
      }}>
      <Stack.Screen
        name="ForumList"
        component={ForumListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Forum" component={ForumScreen} />
    </Stack.Navigator>
  );
};
