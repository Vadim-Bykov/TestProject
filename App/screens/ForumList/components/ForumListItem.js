import React, {useCallback, useEffect, useState} from 'react';
import {Animated, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  BASE_IMAGE_URL,
  DEFAULT_AVATAR,
  DEFAULT_MOVIE_IMAGE,
} from '../../../consts/consts';
import * as utils from '../../../utils/utils';
import {SPACING} from '../ForumListScreen';
import * as firebaseService from '../../../api/firebaseService';
import {useDispatch} from 'react-redux';
import {useAnimatedForumList} from '../hooks/useAnimatedForumList';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export const ForumListItem = React.memo(
  ({
    item,
    index,
    width,
    themeColors,
    scrollY,
    WINDOW_LIST_HEIGHT,
    ITEM_HEIGHT,
    goToForum,
  }) => {
    const dispatch = useDispatch();
    const [creatorData, setCreatorData] = useState(null);

    const goToForumScreen = useCallback(() => {
      goToForum(item.documentId, item.title, item.posterUrl, item.creatorId);
    }, []);

    const CONTENT_HEIGHT = ITEM_HEIGHT - SPACING * 2;
    const IMAGE_SIZE = CONTENT_HEIGHT - SPACING * 2;

    const {translateY, translateX, scale, imageScale, opacity, rotateX} =
      useAnimatedForumList({
        scrollY,
        index,
        ITEM_HEIGHT,
        WINDOW_LIST_HEIGHT,
        width,
      });

    useEffect(async () => {
      try {
        const response = await firebaseService.getFirestoreData(
          'users',
          item.creatorId,
        );
        if (response.exists) setCreatorData(response.data());
      } catch (error) {
        dispatch(utils.extractErrorMessage(error));
      }
    }, []);

    return (
      <Animated.View
        style={[
          styles.container,
          {
            height: ITEM_HEIGHT,
            opacity,
            transform: [
              {translateX},
              {translateY},
              {scale},
              {rotateX},
              {perspective: 1000},
            ],
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={goToForumScreen}
          style={[
            styles.item,
            {
              borderColor: themeColors.border,
              height: CONTENT_HEIGHT,
            },
          ]}>
          <Animated.Image
            source={{
              uri: item.posterUrl
                ? `${BASE_IMAGE_URL}w300${item.posterUrl}`
                : `${DEFAULT_MOVIE_IMAGE}`,
            }}
            style={[
              styles.poster,
              {
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                borderRadius: IMAGE_SIZE / 2,
                transform: [{scale: imageScale}],
              },
            ]}
          />

          <Text style={{color: themeColors.text}}>
            {utils.cutStringToSize(item.title, 15)}
          </Text>

          <View style={styles.creatorImageBlock}>
            <AnimatedFastImage
              source={{
                uri: creatorData?.photoURL
                  ? creatorData.photoURL
                  : creatorData && DEFAULT_AVATAR,
              }}
              style={[
                styles.creatorImage,
                {
                  width: IMAGE_SIZE / 1.5,
                  height: IMAGE_SIZE / 1.5,
                  borderRadius: 5,
                },
                {transform: [{scale: imageScale}]},
              ]}
            />

            <Text style={{color: themeColors.text}}>
              {creatorData?.displayName}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: SPACING,
  },

  poster: {
    marginRight: 10,
  },

  creatorImageBlock: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },

  creatorImage: {},
});
