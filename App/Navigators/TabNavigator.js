import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MoviesScreen} from '../screens/Movies/MoviesScreen';
import {Icon} from 'react-native-elements';
import {HomeStackNavigator} from './HomeStackNavigator';
import {ProfileScreen} from '../screens/Profile/ProfileScreen';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  UIManager,
} from 'react-native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Tab = createBottomTabNavigator();

const MyText = ({children, color}) => (
  <Text style={[styles.tabBarLabel, {color}]}>{children}</Text>
);

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

          return <Icon type={type} name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarLabel: ({focused, color}) => {
          // Platform.OS === 'ios' &&
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          switch (route.name) {
            case 'HomeTab':
              return focused && <MyText color={color}>Home</MyText>;

            case 'Movies':
              return focused && <MyText color={color}>Movies</MyText>;

            case 'Profile':
              return focused && <MyText color={color}>Profile</MyText>;

            default:
              null;
          }
        },
      })}>
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        // options={{
        //   unmountOnBlur: true,
        // }}
      />
      <Tab.Screen name="Movies" component={MoviesScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 10,
    marginBottom: 3,
  },
});
