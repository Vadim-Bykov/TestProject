import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {SPACING_HORIZONTAL, USER_PHOTO_WIDTH} from './MessageItem';

export const MessageContent = React.memo(
  ({message, width, themeColors, showMenu, isOwner, isShowPhoto}) => {
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
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
    marginHorizontal: SPACING_HORIZONTAL / 2,
    borderRadius: 5,
    flexDirection: 'row',
  },
});
