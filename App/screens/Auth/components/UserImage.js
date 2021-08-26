import React, {useCallback} from 'react';
import {Platform, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import {Icon, Avatar} from 'react-native-elements';
import {launchImageLibrary} from 'react-native-image-picker';
import {useDispatch} from 'react-redux';
import {colors} from '../../../consts/consts';
import * as actionsCommon from '../../../store/common/actions';

const options = {
  mediaType: 'photo',
  maxWidth: 300,
  maxHeight: 300,
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
        console.log('assets', assets);
        console.log('imageData', imageData);

        setImageData(imageData);
      }
    },
    [],
  );

  const addPhoto = useCallback(() => {
    launchImageLibrary(options, handleImage);
  }, []);

  return (
    <View style={styles.container}>
      <Icon
        type="entypo"
        name="add-user"
        color={colors.DARK_YELLOW}
        size={imageUri ? 25 : width * 0.3}
        containerStyle={imageUri ? styles.iconWithPhoto : styles.icon}
        onPress={addPhoto}
      />

      {imageUri ? (
        <Avatar rounded source={{uri: imageUri}} size={width * 0.3} />
      ) : (
        <Text style={styles.text}>Add your image</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //  position: 'relative',
  },

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
    color: colors.DARK_YELLOW,
    marginLeft: 15,
    marginTop: 10,
  },
});
