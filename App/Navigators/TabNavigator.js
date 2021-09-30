import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import {HomeStackNavigator} from './HomeStackNavigator';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  useWindowDimensions,
} from 'react-native';
import {ProfileStackNavigator} from './ProfileStackNavigator';
import {MediaStackNavigator} from './MediaStackNavigator';
// import {DrawerNavigator} from './DrawerNavigator';
import {Settings} from '../screens/Settings/Settings';
import {useTheme} from '@react-navigation/native';
import {SavedMediaStack} from './SavedMediaStack';
import {SavedMediaGesture} from '../screens/SavedMediaGesture/SavedMediaGesture';
import {ForumStackNavigator} from './ForumStackNavigator';
import {WebsocketChatScreen} from '../screens/WebsocketCaht/WebsocketChatScreen';

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
  const {colors} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({navigation, route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let type;

          if (route.name === 'HomeTab') {
            type = 'ionicon';
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MediaTab') {
            type = 'ionicon';
            iconName = focused ? 'ios-list' : 'ios-list-outline';

            return (
              <Icon
                type={type}
                name={iconName}
                size={size}
                color={color}
                // onPress={navigation.navigate('MediaTab', {screen: 'Movies'})}
              />
            );
          } else if (route.name === 'ProfileTab') {
            type = 'font-awesome';
            iconName = focused ? 'user-circle-o' : 'user';
          } else if (route.name === 'SettingsTab') {
            type = 'ionicon';
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'SavedMediaTab') {
            type = 'ionicon';
            iconName = focused ? 'save' : 'save-outline';
          } else if (route.name === 'SavedGestureTab') {
            type = 'antdesign';
            iconName = focused ? 'heart' : 'hearto';
          } else if (route.name === 'ForumsTab') {
            type = 'material-community';
            iconName = focused ? 'forum' : 'forum-outline';
          } else if (route.name === 'WebsocketTab') {
            type = 'material-community';
            iconName = 'webrtc';
          }

          return <Icon type={type} name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: colors.textGray,
        tabBarLabel: ({focused, color}) => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          switch (route.name) {
            case 'HomeTab':
              return focused && <MyText color={color}>Home</MyText>;

            case 'MediaTab':
              return focused && <MyText color={color}>Movies</MyText>;

            case 'ProfileTab':
              return focused && <MyText color={color}>Profile</MyText>;

            case 'SettingsTab':
              return focused && <MyText color={color}>Settings</MyText>;

            case 'SavedMediaTab':
              return focused && <MyText color={color}>Saved</MyText>;

            case 'SavedGestureTab':
              return focused && <MyText color={color}>Favorite</MyText>;

            case 'ForumsTab':
              return focused && <MyText color={color}>Forums</MyText>;

            case 'WebsocketTab':
              return focused && <MyText color={color}>Web.io</MyText>;

            default:
              null;
          }
        },
      })}>
      <Tab.Screen name="HomeTab" component={MediaStackNavigator} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} />
      <Tab.Screen
        name="MediaTab"
        component={MediaStackNavigator}
        initialParams={{screen: 'Movies'}}
      />
      <Tab.Screen name="SavedMediaTab" component={SavedMediaStack} />
      <Tab.Screen name="SavedGestureTab" component={SavedMediaGesture} />
      <Tab.Screen name="ForumsTab" component={ForumStackNavigator} />
      {/* <Tab.Screen name="WebsocketTab" component={WebsocketChatScreen} /> */}
      <Tab.Screen name="SettingsTab" component={Settings} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 10,
    marginBottom: 3,
  },
});
