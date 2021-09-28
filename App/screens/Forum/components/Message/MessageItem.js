import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import {DEFAULT_AVATAR} from '../../../../consts/consts';
import * as firebaseService from '../../../../api/firebaseService';
import * as utils from '../../../../utils/utils';
import * as actionsCommon from '../../../../store/common/actions';
import {useDispatch} from 'react-redux';
import {MessageWithContextMenu} from './MessageWithContextMenu';
import {MessageContent} from './MessageContent';

export const USER_PHOTO_WIDTH = 45;
export const SPACING_HORIZONTAL = 10;

export const MessageItem = React.memo(
  ({
    messages,
    item,
    index,
    currentUserId,
    currentUserPhotoUrl,
    width,
    themeColors,
  }) => {
    const dispatch = useDispatch();
    const [creatorData, setCreatorData] = useState(null);

    const isOwner = currentUserId === item.userId;

    const isShowPhoto = useMemo(
      () =>
        index === 0 || messages[index].userId !== messages[index - 1].userId,
      [index],
    );

    useEffect(async () => {
      try {
        if (isOwner) return;

        const querySnapshot = firebaseService.getFirestoreData(
          'users',
          item.userId,
        );

        if ((await querySnapshot).exists) {
          setCreatorData((await querySnapshot).data());
        }
      } catch (error) {
        dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
      }
    }, []);

    const removeDataMessage = useCallback(() => {
      try {
        firebaseService.removeDocument('messages', item.docId);
        firebaseService.removeDocument('likes', item.docId);
        firebaseService.removeDocument('dislikes', item.docId);
      } catch (error) {
        dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
      } finally {
      }
    }, [item.docId]);

    // console.log(new Date(messages[index].timestamp).getHours());
    // console.log(new Date(messages[index].timestamp).getMinutes());

    const hours = new Date(messages[index].timestamp).getHours();
    const minutes = new Date(messages[index].timestamp).getMinutes();

    const messageTime = useMemo(
      () =>
        `${hours.toString().length === 1 ? `0${hours}` : hours}:${
          minutes.toString().length === 1 ? `0${minutes}` : minutes
        }`,
      [],
    );

    const isToday = useMemo(
      () =>
        new Date().getDate() === new Date().getDate(messages[index].timestamp),
      [],
    );

    const date = useMemo(
      () => new Date(messages[index].timestamp).toLocaleDateString(),
      [],
    );

    const isShowDate = useMemo(
      () =>
        index === 0 ||
        new Date(messages[index].timestamp).getDate() !==
          new Date(messages[index - 1].timestamp).getDate(),
      [],
    );

    return (
      <>
        {isShowDate && (
          <Text style={styles.date}>{isToday ? 'Today' : date}</Text>
        )}

        <View
          style={[
            styles.container,
            {
              flexDirection: isOwner ? 'row-reverse' : 'row',
              marginLeft: isShowPhoto ? 0 : USER_PHOTO_WIDTH,
            },
          ]}>
          {isShowPhoto && (
            <FastImage
              source={{
                uri: isOwner
                  ? currentUserPhotoUrl
                  : creatorData?.photoURL || (creatorData && DEFAULT_AVATAR),
              }}
              style={styles.userPhoto}
            />
          )}

          <MessageWithContextMenu
            message={item.message}
            messageId={item.docId}
            width={width}
            themeColors={themeColors}
            currentUserId={currentUserId}
            isOwner={isOwner}
            isShowPhoto={isShowPhoto}
            messageTime={messageTime}
            removeData={removeDataMessage}
            AnchorComponent={MessageContent}
          />
        </View>
      </>
    );
  },
);

const styles = StyleSheet.create({
  date: {
    alignSelf: 'center',
  },

  container: {
    paddingHorizontal: SPACING_HORIZONTAL,
    marginVertical: 5,
  },

  userPhoto: {
    width: USER_PHOTO_WIDTH,
    height: USER_PHOTO_WIDTH,
    borderRadius: 10,
  },
});
