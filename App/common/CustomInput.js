import React from 'react';
import {useController} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {Input} from 'react-native-elements';

export const CustomInput = ({inputConfig}) => {
  const {
    leftIcon: {iconName, type = 'material', color = 'black'},
    width,
    placeholder,
    secureTextEntry = false,
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
      placeholder={placeholder}
      leftIcon={{type, name: iconName, color}}
      errorMessage={fieldState.error && fieldState.error.message}
      errorStyle={{color: 'red'}}
      secureTextEntry={secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({});
