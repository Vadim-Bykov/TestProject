import React, {useCallback, useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {COLORS} from '../../../../consts/consts';
import * as actionsCommon from '../../../../store/common/actions';
import * as utils from '../../../../utils/utils';
import * as firebaseService from '../../../../api/firebaseService';
import firestore from '@react-native-firebase/firestore';

export const LikeComponent = React.memo(
  ({messageId, currentUserId, isOwner}) => {
    const dispatch = useDispatch();
    const [likes, setLikes] = useState(null);
    const [dislikes, setDislikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const onResultLikes = useCallback(
      querySnapshot => {
        if (querySnapshot.exists) {
          const likes = querySnapshot.data();

          const isLiked = utils.getIsIncludeArray(likes.userIds, currentUserId);

          setLikes(likes);
          setIsLiked(isLiked);
        }

        setDisabled(false);
      },
      [messageId],
    );

    const onResultDislikes = useCallback(
      querySnapshot => {
        if (querySnapshot.exists) {
          const dislikes = querySnapshot.data();

          const isDisliked = utils.getIsIncludeArray(
            dislikes.userIds,
            currentUserId,
          );

          setDislikes(dislikes);
          setIsDisliked(isDisliked);
        }

        setDisabled(false);
      },
      [messageId],
    );

    const onError = useCallback(error => {
      dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
    }, []);

    useEffect(() => {
      const likeSubscriber = firebaseService.observeDocument(
        'likes',
        messageId,
        onResultLikes,
        onError,
      );

      const dislikeSubscriber = firebaseService.observeDocument(
        'dislikes',
        messageId,
        onResultDislikes,
        onError,
      );

      return () => {
        likeSubscriber();
        dislikeSubscriber;
      };
    }, [messageId]);

    const addLike = useCallback(
      async number => {
        setDisabled(true);

        try {
          firebaseService.updateField('likes', messageId, {
            userIds:
              number === 1
                ? firestore.FieldValue.arrayUnion(currentUserId)
                : firestore.FieldValue.arrayRemove(currentUserId),
            count: (likes?.count || 0) + number,
          });
        } catch (error) {
          dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
        }
      },
      [messageId, likes],
    );

    const addDislike = useCallback(
      async number => {
        setDisabled(true);

        try {
          firebaseService.updateField('dislikes', messageId, {
            userIds:
              number === 1
                ? firestore.FieldValue.arrayUnion(currentUserId)
                : firestore.FieldValue.arrayRemove(currentUserId),
            count: (dislikes?.count || 0) + number,
          });
        } catch (error) {
          dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
        }
      },
      [messageId, dislikes],
    );

    const warnOwner = useCallback(like => {
      Alert.alert(
        "It's your message!",
        `You can't ${like} your oun message. Please, ${like} another one.`,
      );
    }, []);

    const putLike = useCallback(() => {
      if (isOwner) return warnOwner('like');

      if (isLiked) {
        addLike(-1);
      } else if (isDisliked) {
        addLike(1);
        addDislike(-1);
      } else {
        addLike(1);
      }
    }, [isLiked, isDisliked, addLike, addDislike]);

    const putDislike = useCallback(() => {
      if (isOwner) return warnOwner('dislike');

      if (isDisliked) {
        addDislike(-1);
      } else if (isLiked) {
        addDislike(1);
        addLike(-1);
      } else {
        addDislike(1);
      }
    }, [isLiked, isDisliked, addLike, addDislike]);

    return (
      <>
        <View>
          <Icon
            type="antdesign"
            name={isDisliked ? 'dislike1' : 'dislike2'}
            color="red"
            size={20}
            disabled={disabled}
            containerStyle={styles.iconContainer}
            onPress={putDislike}
          />

          <Text style={styles.likeCount}>{dislikes?.count || 0}</Text>
        </View>

        <View>
          <Icon
            type="antdesign"
            name={isLiked ? 'like1' : 'like2'}
            color={COLORS.DARK_YELLOW}
            size={20}
            disabled={disabled}
            containerStyle={styles.iconContainer}
            onPress={putLike}
          />

          <Text style={styles.likeCount}>{likes?.count || 0}</Text>
        </View>
      </>
    );
  },
);

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 15,
  },

  likeCount: {
    marginRight: 10,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.GRAY,
  },
});
