import React, {useCallback} from 'react';
import {ScrollView, StyleSheet, Text, useWindowDimensions} from 'react-native';
import {Button} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, DEFAULT_AVATAR} from '../../consts/consts';
import * as selectorsAuth from '../../store/auth/selectors';
import * as selectorsCommon from '../../store/common/selectors';
import * as firebaseService from '../../api/firebaseService';
import {Loader} from '../../common/Loader';
import {ThemeText} from '../../common/ThemeText';

export const ProfileScreen = ({navigation}) => {
  const userData = useSelector(selectorsAuth.getUserData);
  const {width} = useWindowDimensions();
  const isFetching = useSelector(selectorsCommon.getIsFetching);
  const dispatch = useDispatch();

  const logout = useCallback(() => dispatch(firebaseService.logout()), []);

  if (!userData) return null;

  return (
    <>
      {isFetching && <Loader />}

      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <FastImage
            source={{uri: userData.photoURL || DEFAULT_AVATAR}}
            style={[
              styles.userImage,
              {
                width: width * 0.5 > 200 ? 200 : width * 0.5,
                height: width * 0.5 > 200 ? 200 : width * 0.5,
              },
            ]}
          />

          <ThemeText style={styles.description}>
            User name: {userData.displayName}
          </ThemeText>
          <ThemeText>User email: {userData.email}</ThemeText>

          <Button
            title="Edit"
            type="outline"
            containerStyle={styles.btnEditContainer}
            buttonStyle={[styles.btn, styles.btnEdit]}
            titleStyle={styles.btnEditTitle}
            onPress={() => navigation.navigate('EditProfile')}
          />

          <Button
            activeOpacity={0.6}
            title="Logout"
            type="outline"
            icon={{
              type: 'ionicon',
              name: 'ios-log-out-outline',
              color: 'tomato',
            }}
            iconRight
            containerStyle={styles.btnEditContainer}
            buttonStyle={[styles.btn, styles.btnLogout]}
            titleStyle={styles.btnLogoutTitle}
            onPress={logout}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  userImage: {
    borderRadius: 200,
  },

  description: {
    marginVertical: 5,
  },

  btnEditContainer: {
    borderRadius: 15,
    marginVertical: 10,
  },

  btn: {
    width: 100,
    borderRadius: 15,
    borderWidth: 1,
  },

  btnEdit: {
    borderColor: COLORS.BLUE,
  },

  btnEditTitle: {
    color: COLORS.BLUE,
  },

  btnLogout: {
    paddingRight: 15,
    borderColor: 'tomato',
  },

  btnLogoutTitle: {
    color: 'tomato',
  },
});
