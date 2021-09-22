import {useTheme} from '@react-navigation/native';
import React from 'react';
import {Text} from 'react-native';

export const ThemeText = props => {
  const {colors} = useTheme();

  return (
    <Text {...props} style={{...props.style, color: colors.text}}>
      {props.children}
    </Text>
  );
};
