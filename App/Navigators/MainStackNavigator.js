import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {createStackNavigator} from '@react-navigation/stack';
import {useDispatch, useSelector} from 'react-redux';
import {SplashScreen} from '../screens/Splash/SplashScreen';
import * as actionsAuth from '../store/auth/actions';
import * as selectors from '../store/auth/selectors';
import {TabNavigator} from './TabNavigator';
import {StatusBar} from 'react-native';
import {AuthStackNavigator} from './AuthStackNavigator';
import {STACK_SCREEN_OPTIONS} from '../consts/consts';
import {useTheme} from '@react-navigation/native';

const Stack = createStackNavigator();

export const MainStackNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const isAuth = useSelector(selectors.getIsAuth);
  const {colors, dark} = useTheme();

  const dispatch = useDispatch();

  const onAuthStateChanged = user => {
    if (user) {
      dispatch(actionsAuth.setUserData(user));
      dispatch(actionsAuth.setIsAuth(true));
    } else {
      dispatch(actionsAuth.setIsAuth(false));
    }

    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    return subscriber;
  }, []);

  return (
    <>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={!isAuth || !dark ? 'dark-content' : 'light-content'}
      />

      <Stack.Navigator
        screenOptions={{headerShown: false, ...STACK_SCREEN_OPTIONS}}>
        {initializing ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : isAuth ? (
          <Stack.Screen name="Home" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </>
  );
};
