import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MoviesScreen} from '../screens/Movies/MoviesScreen';
import {Icon} from 'react-native-elements';
import {HomeStackNavigator} from './HomeStackNavigator';
import {EditProfileScreen} from '../screens/Profile/EditProfileScreen';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  useWindowDimensions,
} from 'react-native';
import {ProfileStackNavigator} from './ProfileStackNavigator';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Tab = createBottomTabNavigator();

const MyText = ({children, color}) => {
  const {width, height} = useWindowDimensions();

  const isLandscape = width > height;
  return (
    <Text
      style={[
        styles.tabBarLabel,
        {color, marginLeft: isLandscape ? 15 : 0},
        {color, marginTop: isLandscape ? 5 : 0},
      ]}>
      {children}
    </Text>
  );
};

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let type;

          if (route.name === 'Home') {
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
            case 'Home':
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
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
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
