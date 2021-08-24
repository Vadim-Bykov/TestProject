import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
ScrollView;
import auth from '@react-native-firebase/auth';
import {useForm} from 'react-hook-form';
import {CustomInput} from '../../common/CustomInput';
import {Button} from 'react-native-elements';
import {color} from 'react-native-elements/dist/helpers';
import * as firebaseService from '../../api/firebaseService';

export const HomeScreen = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const {width} = useWindowDimensions();
  const {handleSubmit, control} = useForm();

  const userNameConfig = {
    leftIcon: {iconName: 'user', type: 'font-awesome'},
    width,
    placeholder: 'Enter your name',
    secureTextEntry: false,
    control,
    name: 'userName',
    rules: {
      required: 'This field is required',
      validate: value => !!value.trim() || 'Not only spaces',
    },
  };

  const emailConfig = {
    leftIcon: {iconName: 'email'},
    width,
    placeholder: 'Enter your email',
    secureTextEntry: false,
    control,
    name: 'email',
    rules: {
      required: 'This field is required',
      pattern: {value: /.+@.+\..+/i, message: 'Incorrect email'},
    },
  };

  const passwordConfig = {
    leftIcon: {iconName: 'lock'},
    width,
    placeholder: 'Enter your password',
    secureTextEntry: true,
    control,
    name: 'password',
    rules: {
      required: 'This field is required',
      maxLength: {value: 20, message: 'Exceeded max length 20'},
      minLength: {value: 6, message: 'Not achieved min length 6'},
      validate: value => !!value.trim() || 'Not only spaces',
    },
  };

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onSubmit = useCallback(async userData => {
    console.log(userData);

    // const fireBaseUserData = await firebaseService.signUp(userData);
    const fireBaseUserData = await firebaseService.signIn(userData);

    setUser(fireBaseUserData);
  }, []);

  if (initializing) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}>
        {user ? (
          <>
            <Text style={styles.item}>Welcome {user.email}</Text>
            <Text style={styles.item}>Welcome {user.displayName}</Text>

            <Button
              activeOpacity={0.6}
              title="Logout"
              type="outline"
              icon={{type: 'ionicon', name: 'ios-log-out-outline'}}
              iconRight
              buttonStyle={{paddingRight: 15, borderColor: '#000000'}}
              titleStyle={{color: '#000000'}}
              onPress={() => firebaseService.logout()}
            />
          </>
        ) : (
          <>
            <Text>Login please</Text>
            <CustomInput inputConfig={userNameConfig} />
            <CustomInput inputConfig={emailConfig} />
            <CustomInput inputConfig={passwordConfig} />

            <Button
              activeOpacity={0.6}
              title="Submit"
              type="outline"
              icon={{type: 'antdesign', name: 'enter'}}
              iconRight
              buttonStyle={{paddingRight: 15, borderColor: '#000000'}}
              titleStyle={{color: '#000000'}}
              onPress={handleSubmit(onSubmit)}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: 'green',
  },
  scrollViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'blue',
  },
  item: {},
});
