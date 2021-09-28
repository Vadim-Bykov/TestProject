import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {colors, Icon} from 'react-native-elements';
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
      <Stack.Screen
        name="Forum"
        component={ForumScreen}
        options={({route}) => ({
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerTitle: route.params.title,
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
          headerRightContainerStyle: styles.headerRightContainer,
        })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerRightContainer: {
    paddingRight: 10,
  },
});
