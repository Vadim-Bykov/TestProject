import React, {useCallback, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  ScrollView,
  StyleSheet,
  Text,
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

export const ProfileScreen = React.memo(() => {
  const userData = useSelector(selectorsAuth.getUserData);
  const isFetching = useSelector(selectorsCommon.getIsFetching);
  const error = useSelector(selectorsCommon.getError);
  const {width} = useWindowDimensions();
  const {control, handleSubmit} = useForm();
  const [preloadedImage, setPreloadedImage] = useState(null);
  const dispatch = useDispatch();

  if (!userData) return null;

  const {displayName, email, phoneNumber, photoURL} = userData;

  const userNameConfig = useMemo(
    () => ({
      leftIcon: {iconName: 'user', type: 'font-awesome', color: colors.BLUE},
      width,
      placeholder: displayName
        ? `Current name: ${displayName}`
        : 'Enter your name',
      control,
      name: 'userName',
      rules: {
        required: 'This field is required',
        validate: value => !!value.trim() || 'Not only spaces',
      },
      label: 'Your name',
      defaultValue: displayName,
      borderColor: colors.BLUE,
      textColor: colors.BLACK,
    }),
    [userData],
  );

  const emailConfig = useMemo(
    () => ({
      leftIcon: {iconName: 'email', color: colors.BLUE},
      width,
      placeholder: email ? `Current email: ${email}` : 'Enter your email',
      control,
      name: 'email',
      rules: {
        required: 'This field is required',
        pattern: {value: /.+@.+\..+/i, message: 'Incorrect email'},
      },
      label: 'Email',
      defaultValue: email,
      borderColor: colors.BLUE,
      textColor: colors.BLACK,
    }),
    [userData],
  );

  //   const phoneNumberConfig = useMemo(
  //     () => ({
  //       leftIcon: {iconName: 'phone', type: 'font-awesome', color: colors.BLUE},
  //       width,
  //       placeholder: phoneNumber
  //         ? `Current number: ${phoneNumber}`
  //         : 'Enter your phone number',
  //       control,
  //       name: 'phoneNumber',
  //       rules: {
  //         required: 'This field is required',
  //         validate: value => !!value.trim() || 'Not only spaces',
  //       },
  //       label: 'Phone number',
  //       defaultValue: phoneNumber,
  //       borderColor: colors.BLUE,
  //       textColor: colors.BLACK,
  //     }),
  //     [userData],
  //   );

  const photoUrlConfig = useMemo(
    () => ({
      leftIcon: {iconName: 'photo-camera', color: colors.BLUE},
      width: width * 0.9,
      multiline: true,
      placeholder: photoURL ? `Current url: ${photoURL}` : 'Enter photo url',
      control,
      name: 'photoURL',
      rules: {
        required: 'This field is required',
        validate: value => !!value.trim() || 'Not only spaces',
      },
      label: 'Phone number',
      defaultValue: photoURL,
      borderColor: colors.BLUE,
      textColor: colors.BLACK,
      setPreloadedImage,
    }),
    [userData],
  );

  const onSubmit = useCallback(data => {
    console.log(data);
    dispatch(firebaseService.updateUserProfile(data));
  }, []);

  return (
    <>
      {isFetching && <Loader />}
      {error && <Error />}

      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <CustomInput inputConfig={userNameConfig} />
          <CustomInput inputConfig={emailConfig} />
          {/* <CustomInput inputConfig={phoneNumberConfig} /> */}
          <View style={styles.photoUrlContainer}>
            <CustomInput inputConfig={photoUrlConfig} />
            <Avatar
              source={{uri: preloadedImage || photoURL || DEFAULT_AVATAR}}
              rounded
              size={width * 0.15}
            />
          </View>

          <Button
            title="Save"
            type="outline"
            onPress={handleSubmit(onSubmit)}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
});

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
