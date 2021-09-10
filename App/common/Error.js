import React, {useCallback} from 'react';
import {Modal, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../consts/consts';
import * as actionsCommon from '../store/common/actions';
import * as selectorsCommon from '../store/common/selectors';

export const Error = () => {
  const error = useSelector(selectorsCommon.getError);
  const dispatch = useDispatch();
  const {width} = useWindowDimensions();

  const onClose = useCallback(() => {
    dispatch(actionsCommon.setError(null));
  }, []);

  return (
    <Modal
      visible={!!error}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, {width: width * 0.8}]}>
          <Icon type="material" name="error" color="red" size={28} />
          <Text style={styles.modalText}>{error}</Text>
          <Icon
            type="simple-line-icon"
            name="close"
            containerStyle={styles.iconClose}
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1,
  },

  modalView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },

  modalText: {
    flexShrink: 1,
    marginHorizontal: 10,
  },

  iconClose: {
    backgroundColor: '#DDDDDD',
    borderRadius: 13,
  },
});
