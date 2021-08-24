import React, {useCallback} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  useWindowDimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
ScrollView;
import {useForm} from 'react-hook-form';
import {CustomInput} from '../../../common/CustomInput';
import {Button} from 'react-native-elements';
import * as firebaseService from '../../../api/firebaseService';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../../../consts/consts';
import * as selectorsCommon from '../../../store/common/selectors';
import {Loader} from '../../../common/Loader';

export const AuthPage = ({isSignUp, goToAnotherStackScreen}) => {
  const {width} = useWindowDimensions();
  const {handleSubmit, control} = useForm();
  const dispatch = useDispatch();
  const isFetching = useSelector(selectorsCommon.getIsFetching);
  const error = useSelector(selectorsCommon.getError);

  console.log(error);

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

  const onSubmit = useCallback(userData => {
    isSignUp
      ? dispatch(firebaseService.signUp(userData))
      : dispatch(firebaseService.signIn(userData));
  }, []);

  return (
    <>
      {isFetching && <Loader />}

      <ImageBackground
        style={styles.container}
        source={require('../../../assets/city.jpg')}>
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContainer}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}>
            <>
              <Text>Login please</Text>
              {isSignUp && <CustomInput inputConfig={userNameConfig} />}
              <CustomInput inputConfig={emailConfig} />
              <CustomInput inputConfig={passwordConfig} />

              <Button
                activeOpacity={0.6}
                title="Submit"
                type="outline"
                icon={{type: 'antdesign', name: 'enter'}}
                iconRight
                buttonStyle={{paddingRight: 15, borderColor: colors.BLACK}}
                titleStyle={{color: colors.BLACK}}
                onPress={handleSubmit(onSubmit)}
              />

              <TouchableOpacity onPress={goToAnotherStackScreen}>
                <Text>{isSignUp ? 'Are you here?' : 'New here?'}</Text>
              </TouchableOpacity>
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
  scrollViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'blue',
  },
  item: {},
});
