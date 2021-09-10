import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Button, Avatar} from 'react-native-elements';
import * as firebaseService from '../../api/firebaseService';
import {useDispatch, useSelector} from 'react-redux';
import * as selectorsAuth from '../../store/auth/selectors';
import * as selectorsCommon from '../../store/common/selectors';
import {Loader} from '../../common/Loader';
import {ThemeText} from '../../common/ThemeText';
import {useTheme} from '@react-navigation/native';

export const HomeScreen = () => {
  const dispatch = useDispatch();

  const userData = useSelector(selectorsAuth.getUserData);
  const isFetching = useSelector(selectorsCommon.getIsFetching);
  const {colors} = useTheme();

  const logout = useCallback(() => dispatch(firebaseService.logout()), []);

  if (!userData) return null;

  return (
    <>
      {isFetching && <Loader />}

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}>
          <>
            <ThemeText style={styles.item}>Welcome {userData.email}</ThemeText>
            <ThemeText style={styles.item}>
              Welcome {userData.displayName}
            </ThemeText>
            {userData.photoURL && (
              <Avatar source={{uri: userData.photoURL}} rounded size={100} />
            )}

            <Button
              activeOpacity={0.6}
              title="Logout"
              type="outline"
              icon={{
                type: 'ionicon',
                name: 'ios-log-out-outline',
                color: colors.text,
              }}
              iconRight
              buttonStyle={{paddingRight: 15, borderColor: colors.text}}
              titleStyle={{color: colors.text}}
              onPress={logout}
            />
          </>
        </ScrollView>
      </SafeAreaView>
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
