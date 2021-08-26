import React, {useCallback} from 'react';
import {useController} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {Input} from 'react-native-elements';
import {colors} from '../consts/consts';

export const CustomInput = React.memo(({inputConfig}) => {
  const {
    leftIcon: {iconName, type = 'material', color = colors.DARK_YELLOW},
    width,
    placeholder,
    multiline = false,
    secureTextEntry = false,
    onChangeSecureTextEntry,
    control,
    name,
    rules,
    defaultValue = '',
    label = false,
    borderColor = colors.DARK_YELLOW,
    textColor = colors.DARK_YELLOW,
    setPreloadedImage = () => {},
  } = inputConfig;
  //   console.log(iconName);

  const {field, fieldState} = useController({
    control,
    name,
    defaultValue,
    rules,
  });

  const preloadImage = useCallback(() => {
    setPreloadedImage(field.value);
  }, [field.value]);

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
        name.toLowerCase().includes('password') && {
          name: secureTextEntry ? 'eye-check-outline' : 'eye-off-outline',
          type: 'material-community',
          color,
          onPress: onChangeSecureTextEntry,
        }
      }
      errorMessage={fieldState.error && fieldState.error.message}
      errorStyle={styles.error}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#c2c2d6"
      multiline={multiline}
      onBlur={preloadImage}
    />
  );
});

const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
});
