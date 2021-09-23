import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import * as firebaseService from '../../../../api/firebaseService';
import * as actionsCommon from '../../../../store/common/actions';
import * as selectorsCommon from '../../../../store/auth/selectors';
import {useRoute} from '@react-navigation/native';
import * as utils from '../../../../utils/utils';
import {COLORS} from '../../../../consts/consts';

export const SaveFirestore = React.memo(({mediaDetails}) => {
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [page, setPage] = useState(1);
  const userData = useSelector(selectorsCommon.getUserData);
  const {mediaType, id} = useRoute().params;

  const title = useMemo(
    () => (mediaType === 'movie' ? mediaDetails.title : mediaDetails.name),
    [],
  );

  useEffect(async () => {
    try {
      const res = await firebaseService.getFirestoreData('forums', id);

      setIsSaved(res.exists);
    } catch (error) {
      dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
    } finally {
      setDisabled(false);
    }
  }, []);

  const createForum = useCallback(async () => {
    try {
      setDisabled(true);

      await firebaseService
        .saveMediaToForums('forums', id, {
          documentId: id,
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
        .removeDataFromForums('forums', id)
        .then(() => setIsSaved(false));
    } catch (error) {
      dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
    } finally {
      setDisabled(false);
    }
  }, []);

  return (
    <View>
      <Icon
        type="ionicon"
        name={isSaved ? 'save' : 'save-outline'}
        color="tomato"
        disabled={disabled}
        disabledStyle={styles.disabledStyle}
        onPress={isSaved ? removeForum : createForum}
      />
      <Text>{isSaved ? 'Saved' : 'Save'}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  disabledStyle: {
    backgroundColor: COLORS.BG_TRANSPARENT_GRAY,
  },
});
