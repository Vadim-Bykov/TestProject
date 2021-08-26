import React from 'react';
import {useController} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {Input} from 'react-native-elements';
import {colors} from '../consts/consts';

export const CustomInput = React.memo(({inputConfig}) => {
  const {
    leftIcon: {iconName, type = 'material', color = colors.DARK_YELLOW},
    width,
    placeholder,
    secureTextEntry = false,
    onChangeSecureTextEntry,
    control,
    name,
    rules,
  } = inputConfig;
  //   console.log(iconName);

  const {field, fieldState} = useController({
    control,
    name,
    defaultValue: '',
    rules,
  });

  return (
    <Input
      value={field.value}
      onChangeText={field.onChange}
      containerStyle={{width: width * 0.8}}
      inputContainerStyle={styles.inputContainer}
      inputStyle={{color: colors.DARK_YELLOW}}
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
      errorStyle={{color: 'red'}}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#c2c2d6"
    />
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    // backgroundColor: colors.BG_TRANSPARENT_GRAY,
    borderBottomColor: colors.DARK_YELLOW,
  },
});
