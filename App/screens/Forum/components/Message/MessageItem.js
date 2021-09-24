import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {DEFAULT_AVATAR} from '../../../../consts/consts';
import * as firebaseService from '../../../../api/firebaseService';
import * as utils from '../../../../utils/utils';
import * as actionsCommon from '../../../../store/common/actions';
import * as selectorsCommon from '../../../../store/auth/selectors';
import {useDispatch} from 'react-redux';

const USER_PHOTO_WIDTH = 45;
const SPACING_HORIZONTAL = 10;

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
      [],
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

    return (
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

        <View
          style={[
            styles.contentContainer,
            {
              width: width - USER_PHOTO_WIDTH * 2,
              backgroundColor: isOwner
                ? themeColors.backgroundBlue
                : themeColors.backgroundGray,
              flexDirection: isOwner ? 'row-reverse' : 'row',
              borderTopLeftRadius: !isOwner && isShowPhoto ? 0 : 5,
              borderTopRightRadius: isOwner && isShowPhoto ? 0 : 5,
            },
          ]}>
          <Text>{item.message}</Text>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING_HORIZONTAL,
    marginVertical: 5,
    //  backgroundColor: 'blue',
  },

  userPhoto: {
    width: USER_PHOTO_WIDTH,
    height: USER_PHOTO_WIDTH,
    borderRadius: 10,
  },

  contentContainer: {
    padding: 10,
    marginHorizontal: SPACING_HORIZONTAL / 2,
    borderRadius: 5,
  },
});
