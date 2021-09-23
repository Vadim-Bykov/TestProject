import React, {useEffect, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import * as firebaseService from '../../api/firebaseService';
import {BASE_IMAGE_URL, DEFAULT_MOVIE_IMAGE} from '../../consts/consts';
import * as actionsCommon from '../../store/common/actions';
import * as utils from '../../utils/utils';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export const ForumScreen = ({route}) => {
  const dispatch = useDispatch;
  const [forumData, setForumData] = useState(null);
  const {docId} = route.params;

  useEffect(async () => {
    try {
      const querySnapshot = await firebaseService.getFirestoreData(
        'forums',
        docId,
      );

      if (querySnapshot.exists) setForumData(querySnapshot.data());
    } catch (error) {
      dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
    }
  }, []);

  return (
    <>
      <Animated.Image
        source={{
          uri: forumData?.posterUrl
            ? `${BASE_IMAGE_URL}original${forumData.posterUrl}`
            : DEFAULT_MOVIE_IMAGE,
        }}
        blurRadius={10}
        style={styles.imageBackGround}
      />

      <SafeAreaView style={styles.container}>
        <Text>{forumData?.title}</Text>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  imageBackGround: {
    position: 'absolute',
    ...StyleSheet.absoluteFill,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
