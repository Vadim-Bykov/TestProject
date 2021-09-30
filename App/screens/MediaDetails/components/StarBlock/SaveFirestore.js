import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import * as firebaseService from '../../../../api/firebaseService';
import * as actionsCommon from '../../../../store/common/actions';
import * as selectorsCommon from '../../../../store/auth/selectors';
import {useRoute} from '@react-navigation/native';
import * as utils from '../../../../utils/utils';
import {COLORS} from '../../../../consts/consts';
import {handleNewForumNotification} from '../../../../notification/notification';

export const SaveFirestore = React.memo(({mediaDetails}) => {
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isOwner, setIsOwner] = useState(true);
  const userData = useSelector(selectorsCommon.getUserData);
  const {mediaType, id} = useRoute().params;

  const title = useMemo(
    () => (mediaType === 'movie' ? mediaDetails.title : mediaDetails.name),
    [],
  );

  useEffect(async () => {
    try {
      const res = await firebaseService.getFirestoreData('forums', id);

      if (res.exists) {
        setIsOwner(res.data().creatorId === userData?.uid);
      }

      setIsSaved(res.exists);
    } catch (error) {
      dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
    } finally {
      setDisabled(false);
    }
  }, []);

  const createForum = useCallback(async () => {
    handleNewForumNotification(title, userData?.displayName, id);

    try {
      setDisabled(true);

      await firebaseService
        .saveMediaToForums('forums', id.toString(), {
          documentId: id.toString(),
          creatorId: userData.uid,
          timestamp: Date.now(),
          title,
          posterUrl: mediaDetails.poster_path,
        })
        .then(() => setIsSaved(true));
    } catch (error) {
      console.log(error);
      dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
    } finally {
      setDisabled(false);
    }
  }, []);

  const removeForum = useCallback(() => {
    try {
      setDisabled(true);
      firebaseService
        .removeDocument('forums', id.toString())
        .then(() => {
          firebaseService.massDocsDelete('messages', id.toString(), 'forumId');
          firebaseService.massDocsDelete('likes', id.toString(), 'forumId');
          firebaseService.massDocsDelete('dislikes', id.toString(), 'forumId');
        })
        .then(() => setIsSaved(false));
    } catch (error) {
      dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
    } finally {
      setDisabled(false);
    }
  }, []);

  const warnBeforeRemoving = useCallback(() => {
    Alert.alert(
      'Removing from forums',
      "Are you sure? You'll remove all forum messages as well!",
      [{text: 'Cancel'}, {text: 'Yes', onPress: removeForum}],
    );
  }, []);

  return (
    <View>
      <Icon
        type="ionicon"
        name={isSaved ? 'save' : 'save-outline'}
        color="tomato"
        disabled={disabled || !isOwner}
        disabledStyle={styles.disabledStyle}
        onPress={isSaved ? warnBeforeRemoving : createForum}
      />
      {isOwner ? (
        <Text>{isSaved ? 'Saved' : 'Save'}</Text>
      ) : (
        <Text>You aren't creator</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  disabledStyle: {
    backgroundColor: COLORS.WHITE,
  },
});
