import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';
import {Button, Avatar} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {CustomInput} from '../../common/CustomInput';
import {colors, DEFAULT_AVATAR} from '../../consts/consts';
import * as selectorsAuth from '../../store/auth/selectors';
import * as firebaseService from '../../api/firebaseService';
import * as selectorsCommon from '../../store/common/selectors';
import {Loader} from '../../common/Loader';
import {Error} from '../../common/Error';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const ProfileScreen = ({navigation}) => {
  const userData = useSelector(selectorsAuth.getUserData);
  const isFetching = useSelector(selectorsCommon.getIsFetching);
  const error = useSelector(selectorsCommon.getError);
  const {width} = useWindowDimensions();
  const {control, handleSubmit, reset} = useForm();
  const [preloadedImage, setPreloadedImage] = useState(null);
  const [isAdditionalInputs, setIsAdditionalInputs] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [updateCount, setUpdateCount] = useState(0);

  console.log('ProfileScreen', isFetching);

  const dispatch = useDispatch();

  useEffect(() => {
    updateCount > 0 && setTimeout(() => navigation.navigate('HomeTab'), 1000);
  }, [updateCount]);

  const userNameConfig = useMemo(
    () => ({
      leftIcon: {iconName: 'user', type: 'font-awesome', color: colors.BLUE},
      width,
      placeholder: userData?.displayName
        ? `Current name: ${userData?.displayName}`
        : 'Enter your name',
      control,
      name: 'userName',
      rules: {
        required: 'This field is required',
        validate: value => !!value.trim() || 'Not only spaces',
      },
      label: 'Your name',
      defaultValue: userData?.displayName,
      borderColor: colors.BLUE,
      textColor: colors.BLACK,
    }),
    [userData],
  );

  const currentEmailConfig = useMemo(
    () => ({
      leftIcon: {iconName: 'email', color: colors.BLUE},
      rightIcon: {
        rightIconName: isAdditionalInputs ? 'close' : 'edit',
        rightIconColor: colors.BLUE,
        onPress: () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setIsAdditionalInputs(prev => !prev);
        },
      },
      width,
      placeholder: userData?.email,
      control,
      name: 'currentEmail',
      rules: {
        required: 'This field is required',
        pattern: {value: /.+@.+\..+/i, message: 'Incorrect email'},
      },
      label: 'Email',
      defaultValue: userData?.email,
      borderColor: colors.BLUE,
      textColor: colors.BLACK,
      editable: false,
    }),
    [userData, isAdditionalInputs],
  );

  const newEmailConfig = useMemo(
    () => ({
      leftIcon: {iconName: 'email', color: colors.BLUE},
      width,
      placeholder: 'Enter new email address',
      control,
      name: 'newEmail',
      rules: {
        required: 'This field is required',
        pattern: {value: /.+@.+\..+/i, message: 'Incorrect email'},
      },
      label: 'New email',
      borderColor: colors.BLUE,
      textColor: colors.BLACK,
    }),
    [userData],
  );

  const passwordConfig = useMemo(
    () => ({
      leftIcon: {iconName: 'lock', color: colors.BLUE},
      rightIcon: {
        rightIconName: secureTextEntry
          ? 'eye-check-outline'
          : 'eye-off-outline',
        rightIconType: 'material-community',
        rightIconColor: colors.BLUE,
        onPress: () => setSecureTextEntry(prev => !prev),
      },
      width,
      placeholder: 'Enter your password',
      secureTextEntry: secureTextEntry,
      control,
      name: 'password',
      rules: {
        required: 'This field is required',
        maxLength: {value: 20, message: 'Exceeded max length 20'},
        minLength: {value: 6, message: 'Not achieved min length 6'},
        validate: value => !!value.trim() || 'Not only spaces',
      },
      label: 'Password',
      borderColor: colors.BLUE,
      textColor: colors.BLACK,
    }),
    [secureTextEntry],
  );

  const photoUrlConfig = useMemo(
    () => ({
      leftIcon: {iconName: 'photo-camera', color: colors.BLUE},
      width: width * 0.9,
      multiline: true,
      placeholder: userData?.photoURL
        ? `Current url: ${userData?.photoURL}`
        : 'Enter photo url',
      control,
      name: 'photoURL',
      rules: {
        required: 'This field is required',
        validate: value => !!value.trim() || 'Not only spaces',
      },
      label: 'Phone number',
      defaultValue: userData?.photoURL,
      borderColor: colors.BLUE,
      textColor: colors.BLACK,
      setPreloadedImage,
    }),
    [userData],
  );

  const onSubmit = useCallback(async data => {
    const res = await dispatch(
      firebaseService.updateUserProfile(
        data,

        // navigation.navigate('HomeTab'),
      ),
    );
    console.log('res', res);
    if (res) {
      setUpdateCount(prev => prev + 1);
      reset();
    }
  }, []);

  if (!userData) return null;

  return (
    <>
      {isFetching && <Loader />}
      {error && <Error />}

      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <CustomInput inputConfig={userNameConfig} />
          <CustomInput inputConfig={currentEmailConfig} />
          {isAdditionalInputs && <CustomInput inputConfig={newEmailConfig} />}
          {isAdditionalInputs && <CustomInput inputConfig={passwordConfig} />}
          <View style={styles.photoUrlContainer}>
            <CustomInput inputConfig={photoUrlConfig} />
            <Avatar
              source={{
                uri: preloadedImage || userData?.photoURL || DEFAULT_AVATAR,
              }}
              rounded
              size={width * 0.15}
            />
          </View>

          <Button
            title="Save"
            type="outline"
            onPress={handleSubmit(onSubmit)}
            buttonStyle={{borderRadius: 15, borderWidth: 1}}
            containerStyle={{borderRadius: 15, marginBottom: 10}}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    alignItems: 'center',
  },

  photoUrlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
