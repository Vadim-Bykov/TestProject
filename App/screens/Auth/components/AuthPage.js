import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  useWindowDimensions,
  ImageBackground,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
ScrollView;
import {useForm, useWatch} from 'react-hook-form';
import {CustomInput} from '../../../common/CustomInput';
import {Button} from 'react-native-elements';
import * as firebaseService from '../../../api/firebaseService';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../../../consts/consts';
import * as selectorsCommon from '../../../store/common/selectors';
import {Loader} from '../../../common/Loader';
import {Error} from '../../../common/Error';
import FastImage from 'react-native-fast-image';
import {UserImage} from './UserImage';

export const AuthPage = ({isSignUp, redirectTo}) => {
  const {width} = useWindowDimensions();
  const {handleSubmit, control} = useForm();
  const password = useWatch({control, defaultValue: '', name: 'password'});
  const dispatch = useDispatch();
  const isFetching = useSelector(selectorsCommon.getIsFetching);
  const error = useSelector(selectorsCommon.getError);
  const [secureTextEntryPassword, setSecureTextEntryPassword] = useState(true);
  const [secureTextEntryConfirmPassword, setSecureTextEntryConfirmPassword] =
    useState(true);
  const [imageData, setImageData] = useState(null);

  const onChangeSecureTextEntryPassword = useCallback(() => {
    setSecureTextEntryPassword(prev => !prev);
  }, [secureTextEntryPassword]);

  const onChangeSecureTextEntryConfirmPassword = useCallback(() => {
    setSecureTextEntryConfirmPassword(prev => !prev);
  }, [secureTextEntryConfirmPassword]);

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
    secureTextEntry: secureTextEntryPassword,
    onChangeSecureTextEntry: onChangeSecureTextEntryPassword,
    control,
    name: 'password',
    rules: {
      required: 'This field is required',
      maxLength: {value: 20, message: 'Exceeded max length 20'},
      minLength: {value: 6, message: 'Not achieved min length 6'},
      validate: value => !!value.trim() || 'Not only spaces',
    },
  };

  const confirmPasswordConfig = {
    leftIcon: {iconName: 'lock'},
    width,
    placeholder: 'Confirm your password',
    secureTextEntry: secureTextEntryConfirmPassword,
    onChangeSecureTextEntry: onChangeSecureTextEntryConfirmPassword,
    control,
    name: 'confirmPassword',
    rules: {
      required: 'This field is required',
      maxLength: {value: 20, message: 'Exceeded max length 20'},
      minLength: {value: 6, message: 'Not achieved min length 6'},
      validate: value => value === password || 'The password do not match',
    },
  };

  const onSubmit = useCallback(
    userData => {
      if (isSignUp) {
        dispatch(
          firebaseService.signUp({
            ...userData,
            uri: imageData?.uri,
            fileName: imageData?.fileName,
          }),
        );
      } else {
        dispatch(firebaseService.signIn(userData));
      }
    },
    [imageData],
  );

  return (
    <>
      {isFetching && <Loader />}
      {error && <Error />}

      <ImageBackground
        style={styles.container}
        source={require('../../../assets/images/city.jpg')}>
        <SafeAreaView style={styles.safeAreaView}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContainer}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}>
            <>
              <View style={styles.logoContainer}>
                {isSignUp ? (
                  <UserImage
                    imageUri={imageData && imageData.uri}
                    setImageData={setImageData}
                    width={width}
                  />
                ) : (
                  <FastImage
                    source={require('../../../assets/images/logoInstagram.png')}
                    style={[
                      styles.logo,
                      {width: width * 0.3, height: width * 0.3},
                    ]}
                  />
                )}
              </View>

              {isSignUp && <CustomInput inputConfig={userNameConfig} />}
              <CustomInput inputConfig={emailConfig} />
              <CustomInput inputConfig={passwordConfig} />
              {isSignUp && <CustomInput inputConfig={confirmPasswordConfig} />}

              <Button
                activeOpacity={0.6}
                title={isSignUp ? 'Sign up' : 'Sign in'}
                type="outline"
                icon={{
                  type: 'antdesign',
                  name: 'enter',
                  color: colors.DARK_YELLOW,
                }}
                iconRight
                buttonStyle={styles.button}
                titleStyle={{color: colors.DARK_YELLOW}}
                onPress={handleSubmit(onSubmit)}
              />

              <View style={styles.redirectContainer}>
                <TouchableOpacity onPress={redirectTo} activeOpacity={0.6}>
                  <Text style={styles.redirectText}>
                    {isSignUp ? 'Are you here? Sign in?' : 'New here? Sign up?'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: 'green',
  },

  safeAreaView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.BG_TRANSPARENT_GRAY,
  },

  scrollViewContainer: {
    // justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'blue',
    flexGrow: 1,
  },

  logoContainer: {
    // height: 100,
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
    paddingTop: 10,
    // backgroundColor: 'blue',
  },

  logo: {},

  button: {
    paddingRight: 15,
    borderWidth: 1,
    borderColor: colors.DARK_YELLOW,
    borderRadius: 15,
    // backgroundColor: colors.DARK_YELLOW,
  },

  redirectContainer: {
    flexShrink: 1,
    flexGrow: 1,
    justifyContent: 'flex-end',
    marginBottom: Platform.select({
      ios: 0,
      android: 10,
    }),
    marginVertical: 10,
    // backgroundColor: 'blue',
  },

  redirectText: {
    color: colors.WHITE,
  },
});
