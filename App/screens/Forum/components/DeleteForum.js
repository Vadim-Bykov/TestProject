import React from 'react';
import {Platform} from 'react-native';
import {Icon} from 'react-native-elements';
import {COLORS} from '../../../consts/consts';

export const DeleteForum = ({showMenu}) => {
  return (
    <Icon
      type="antdesign"
      name="delete"
      color={Platform.select({
        ios: COLORS.PRIMARY,
        android: COLORS.BLACK,
      })}
      onPress={showMenu}
    />
  );
};
