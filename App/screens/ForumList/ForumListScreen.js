import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import * as firebaseService from '../../api/firebaseService';
import * as actionsCommon from '../../store/common/actions';
import * as utils from '../../utils/utils';

export const ForumListScreen = () => {
  const dispatch = useDispatch();
  const [forums, setForums] = useState([]);

  useEffect(async () => {
    try {
      const forums = [];
      const querySnapshot = await firebaseService.getCollection('forums');
      if (querySnapshot.empty) return;
      querySnapshot.forEach(document => forums.push(document.data()));

      setForums(forums);
    } catch (error) {
      dispatch(actionsCommon);
    }
  }, []);

  const onResult = useCallback(querySnapshot => {
    // if (querySnapshot.empty) return;
    //    querySnapshot.forEach(document => forums.push(document.data()));
    console.log('onResult', querySnapshot.docs);

    querySnapshot.docs.forEach(document =>
      console.log('onResult', document.data()),
    );
    // setForums(forums);
  }, []);

  const onError = useCallback(error => {
    console.log('onError', error);
  }, []);

  useEffect(() => {
    const subscriber = firebaseService.observeCollection(
      'forums',
      onResult,
      onError,
    );

    return subscriber;
  }, []);

  console.log(forums);

  return (
    <SafeAreaView style={styles.container}>
      <Text>ForumListScreen</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
