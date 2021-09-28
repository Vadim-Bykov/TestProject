import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS} from '../../../../consts/consts';
import {LikeComponent} from './LikeComponent';
import {SPACING_HORIZONTAL, USER_PHOTO_WIDTH} from './MessageItem';

export const MessageContent = React.memo(
  ({
    message,
    messageId,
    width,
    themeColors,
    showMenu,
    isOwner,
    currentUserId,
    isShowPhoto,
    messageTime,
  }) => {
    return (
      <TouchableOpacity
        onPress={showMenu}
        activeOpacity={0.8}
        style={[
          styles.contentContainer,
          {
            minWidth: USER_PHOTO_WIDTH * 2,
            maxWidth: width - USER_PHOTO_WIDTH * 2 - SPACING_HORIZONTAL * 2,
            backgroundColor: isOwner
              ? themeColors.backgroundBlue
              : themeColors.backgroundGray,
            borderTopLeftRadius: !isOwner && isShowPhoto ? 0 : 5,
            borderTopRightRadius: isOwner && isShowPhoto ? 0 : 5,
          },
        ]}>
        <Text>{message}</Text>

        <View style={styles.bottomBLock}>
          <LikeComponent
            messageId={messageId}
            currentUserId={currentUserId}
            isOwner={isOwner}
          />

          <Text style={styles.timeMessage}>{messageTime}</Text>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    marginHorizontal: SPACING_HORIZONTAL / 2,
    borderRadius: 5,
  },

  bottomBLock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 5,
  },

  timeMessage: {
    fontSize: 12,
    color: COLORS.GRAY,
  },
});
