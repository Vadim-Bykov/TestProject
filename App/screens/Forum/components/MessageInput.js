import {useTheme} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {useController, useForm} from 'react-hook-form';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import * as firebaseService from '../../../api/firebaseService';
import * as actionsCommon from '../../../store/common/actions';
import * as utils from '../../../utils/utils';

export const MessageInput = ({forumId, userId}) => {
  const {colors} = useTheme();
  const {control, handleSubmit, reset} = useForm();
  const dispatch = useDispatch();
  const [fieldValue, setFieldValue] = useState('');
  const [disabled, setDisabled] = useState(false);

  const {field, fieldState, formState} = useController({
    control,
    name: 'message',
    rules: {
      required: 'This field is required',
      validate: value => !!value.trim() || 'Not only spaces',
    },
  });

  useEffect(() => setFieldValue(field.value?.trim()), [field.value]);

  const submitMessage = useCallback(async ({message}) => {
    setDisabled(true);
    try {
      await firebaseService.addMessage(message, forumId, userId);
      reset();
    } catch (error) {
      dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
    } finally {
      setDisabled(false);
    }
  }, []);

  return (
    <Input
      containerStyle={styles.containerStyle}
      placeholder="Enter your message"
      inputStyle={{color: colors.text}}
      inputContainerStyle={styles.inputContainerStyle}
      leftIcon={<Icon type="antdesign" name="message1" color="violet" />}
      leftIconContainerStyle={styles.leftIconContainerStyle}
      rightIcon={
        fieldValue ? (
          <Icon
            type="ionicon"
            name="send"
            color="violet"
            disabled={disabled}
            onPress={handleSubmit(submitMessage)}
          />
        ) : (
          <Icon type="foundation" name="prohibited" color="violet" />
        )
      }
      rightIconContainerStyle={styles.rightIconContainerStyle}
      multiline
      value={field.value}
      onChangeText={field.onChange}
      // errorMessage={fieldState.error && fieldState.error.message}
      errorStyle={styles.errorStyle}
    />
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    //  backgroundColor: 'blue',
    paddingHorizontal: 0,
  },

  leftIconContainerStyle: {
    paddingLeft: 10,
  },

  inputContainerStyle: {
    borderBottomColor: 'violet',
    borderTopWidth: 1,
    borderTopColor: 'violet',
  },

  rightIconContainerStyle: {
    paddingRight: 10,
  },

  errorStyle: {
    display: 'none',
  },
});
