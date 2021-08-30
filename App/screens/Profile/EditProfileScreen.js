import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useForm, useWatch} from 'react-hook-form';
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';
import {Button, Avatar, Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {CustomInput} from '../../common/CustomInput';
import {colors, DEFAULT_AVATAR} from '../../consts/consts';
import * as selectorsAuth from '../../store/auth/selectors';
import * as firebaseService from '../../api/firebaseService';
import * as selectorsCommon from '../../store/common/selectors';
import {Loader} from '../../common/Loader';
import {Error} from '../../common/Error';
import {UserImage} from '../Auth/components/UserImage';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const EditProfileScreen = ({navigation}) => {
  const userData = useSelector(selectorsAuth.getUserData);
  const isFetching = useSelector(selectorsCommon.getIsFetching);
  const error = useSelector(selectorsCommon.getError);
  const {width} = useWindowDimensions();
  const [isAdditionalInputs, setIsAdditionalInputs] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [imageData, setImageData] = useState(null);
  const dispatch = useDispatch();

  const {control, handleSubmit, reset, unregister, setValue} = useForm({
    defaultValues: {
      userName: userData?.displayName,
      currentEmail: userData?.email,
      photoURL: userData?.photoURL,
    },
  });

  const photoUrlInputValue = useWatch({control, name: 'photoURL'});

  useEffect(() => {
    if (!isAdditionalInputs) {
      unregister(['newEmail', 'password']);
    }
  }, [userData, isAdditionalInputs]);

  useEffect(() => {
    imageData && setValue('photoURL', imageData.uri);
  }, [imageData]);

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
      // defaultValue: userData?.displayName,
      borderColor: colors.BLUE,
      textColor: colors.BLACK,
    }),
    [userData, width],
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
      label: 'Email',
      // defaultValue: userData?.email,
      borderColor: colors.BLUE,
      textColor: colors.BLACK,
      editable: false,
    }),
    [userData, width, isAdditionalInputs],
  );

  const newEmailConfig = useMemo(
    () => ({
      leftIcon: {iconName: 'email', color: colors.BLUE},
      width,
      placeholder: 'Enter new email address',
      control,
      name: 'newEmail',
      rules: isAdditionalInputs
        ? {
            required: 'This field is required',
            pattern: {value: /.+@.+\..+/i, message: 'Incorrect email'},
          }
        : null,
      label: 'New email',
      borderColor: colors.BLUE,
      textColor: colors.BLACK,
    }),
    [userData, width, isAdditionalInputs],
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
      rules: isAdditionalInputs
        ? {
            required: 'This field is required',
            maxLength: {value: 20, message: 'Exceeded max length 20'},
            minLength: {value: 6, message: 'Not achieved min length 6'},
            validate: value => !!value.trim() || 'Not only spaces',
          }
        : null,
      label: 'Password',
      borderColor: colors.BLUE,
      textColor: colors.BLACK,
    }),
    [secureTextEntry, width, isAdditionalInputs],
  );

  const photoUrlConfig = useMemo(
    () => ({
      leftIcon: {iconName: 'photo-camera', color: colors.BLUE},
      // width: width * 0.9,
      width: width * 0.86,
      multiline: true,
      placeholder: userData?.photoURL
        ? `Current url: ${userData?.photoURL}`
        : 'Enter photo url',
      control,
      name: 'photoURL',
      label: 'Photo url',
      // defaultValue: userData?.photoURL,
      borderColor: colors.BLUE,
      textColor: colors.BLACK,
    }),
    [userData, width],
  );

  const onSubmit = useCallback(
    async data => {
      const res = await dispatch(
        firebaseService.updateUserProfile({
          ...data,
          photoURL: data.photoURL.trim(),
          // newEmail: data.newEmail.trim(),
          fileName: imageData?.fileName,
        }),
      );

      if (res) {
        navigation.navigate('Profile');

        reset({
          userName: userData?.displayName,
          currentEmail: userData?.email,
          photoURL: userData?.photoURL,
        });
      }
    },
    [imageData],
  );

  const resetPhotoUrl = useCallback(() => {
    setValue('photoURL', userData?.photoURL);
    setImageData(null);
  }, [userData]);

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
            <View>
              {/* <Avatar
                source={{
                  uri: preloadedImage || userData?.photoURL || DEFAULT_AVATAR,
                }}
                rounded
                size={width * 0.15}
              /> */}

              <UserImage
                imageUri={photoUrlInputValue || DEFAULT_AVATAR}
                setImageData={setImageData}
                width={width * 0.2}
              />
              <Icon
                type="feather"
                name="delete"
                onPress={resetPhotoUrl}
                color={colors.BLUE}
              />
            </View>
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
