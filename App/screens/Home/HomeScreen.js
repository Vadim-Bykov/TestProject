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
import {colors} from '../../consts/consts';
import {Loader} from '../../common/Loader';
import {Error} from '../../common/Error';

export const HomeScreen = () => {
  const dispatch = useDispatch();

  const userData = useSelector(selectorsAuth.getUserData);
  const isFetching = useSelector(selectorsCommon.getIsFetching);
  const error = useSelector(selectorsCommon.getError);

  const logout = useCallback(() => dispatch(firebaseService.logout()), []);

  if (!userData) return null;

  return (
    <>
      {isFetching && <Loader />}
      {error && <Error />}

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}>
          <>
            <Text style={styles.item}>Welcome {userData.email}</Text>
            <Text style={styles.item}>Welcome {userData.displayName}</Text>
            {userData.photoURL && (
              <Avatar source={{uri: userData.photoURL}} rounded size={100} />
            )}

            <Button
              activeOpacity={0.6}
              title="Logout"
              type="outline"
              icon={{type: 'ionicon', name: 'ios-log-out-outline'}}
              iconRight
              buttonStyle={{paddingRight: 15, borderColor: colors.BLACK}}
              titleStyle={{color: colors.BLACK}}
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
