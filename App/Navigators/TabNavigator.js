import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MoviesScreen} from '../screens/Movies/MoviesScreen';
import {Icon} from 'react-native-elements';
import {HomeStackNavigator} from './HomeStackNavigator';
import {ProfileScreen} from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let type;

          if (route.name === 'HomeTab') {
            type = 'ionicon';
            iconName = focused
              ? 'ios-information-circle'
              : 'ios-information-circle-outline';
          } else if (route.name === 'Movies') {
            type = 'ionicon';
            iconName = focused ? 'ios-list' : 'ios-list-outline';
          } else if (route.name === 'Profile') {
            type = 'font-awesome';
            iconName = focused ? 'user-circle-o' : 'user';
          }

          // You can return any component that you like here!
          return <Icon type={type} name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{tabBarLabel: 'Home'}}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Movies" component={MoviesScreen} />
    </Tab.Navigator>
  );
};
