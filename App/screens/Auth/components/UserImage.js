import React, {useCallback} from 'react';
import {Platform, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import {Icon, Avatar} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {launchImageLibrary} from 'react-native-image-picker';
import {useDispatch} from 'react-redux';
import {COLORS} from '../../../consts/consts';
import * as actionsCommon from '../../../store/common/actions';

const options = {
  mediaType: 'photo',
  maxWidth: 500,
  maxHeight: 500,
};

export const UserImage = ({imageUri, setImageData, width}) => {
  const dispatch = useDispatch();

  const handleImage = useCallback(
    ({assets, didCancel, errorMessage, errorCode}) => {
      if (errorCode) {
        dispatch(actionsCommon.setError(errorMessage));
      } else if (didCancel) {
        Platform.OS === 'android' &&
          ToastAndroid.show('Adding an image was canceled', ToastAndroid.SHORT);
      } else {
        const imageData = assets[0];

        setImageData(imageData);
      }
    },
    [],
  );

  const addPhoto = useCallback(() => {
    launchImageLibrary(options, handleImage);
  }, []);

  return (
    <View>
      <Icon
        type="entypo"
        name="add-user"
        color={COLORS.DARK_YELLOW}
        size={imageUri ? 25 : width}
        containerStyle={imageUri ? styles.iconWithPhoto : styles.icon}
        onPress={addPhoto}
      />

      {imageUri ? (
        // <Avatar rounded source={{uri: imageUri}} size={width} />
        <FastImage
          source={{uri: imageUri}}
          style={{width, height: width, borderRadius: width / 2}}
        />
      ) : (
        <Text style={styles.text}>Add your image</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginLeft: 20,
  },

  iconWithPhoto: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    zIndex: 1,
  },

  text: {
    color: COLORS.DARK_YELLOW,
    marginLeft: 15,
    marginTop: 10,
  },
});
