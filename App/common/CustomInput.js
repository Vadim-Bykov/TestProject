import React, {useCallback} from 'react';
import {useController} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {Input} from 'react-native-elements';
import {COLORS} from '../consts/consts';

export const CustomInput = React.memo(({inputConfig}) => {
  const {
    leftIcon: {iconName, type = 'material', color = COLORS.DARK_YELLOW},
    rightIcon: {
      rightIconName = '',
      rightIconType = 'material',
      rightIconColor = COLORS.DARK_YELLOW,
      onPress = () => {},
    } = {},
    width,
    placeholder,
    multiline = false,
    secureTextEntry = false,
    control,
    name,
    rules,
    // defaultValue = '',
    label = false,
    borderColor = COLORS.DARK_YELLOW,
    textColor = COLORS.DARK_YELLOW,
    editable = true,
  } = inputConfig;

  const {field, fieldState} = useController({
    control,
    name,
    // defaultValue,
    rules,
  });

  return (
    <Input
      label={label}
      value={field.value}
      onChangeText={field.onChange}
      containerStyle={{width: width * 0.8}}
      inputContainerStyle={{borderBottomColor: borderColor}}
      inputStyle={{color: textColor}}
      placeholder={placeholder}
      leftIcon={{type, name: iconName, color}}
      rightIcon={
        rightIconName
          ? {
              name: rightIconName,
              type: rightIconType,
              color: rightIconColor,
              onPress,
            }
          : null
      }
      errorMessage={fieldState.error && fieldState.error.message}
      errorStyle={styles.error}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#c2c2d6"
      multiline={multiline}
      editable={editable}
    />
  );
});

const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
});
