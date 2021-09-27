import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {Menu, MenuDivider, MenuItem} from 'react-native-material-menu';
import {MessageContent} from './MessageContent';
import * as firebaseService from '../../../../api/firebaseService';
import * as utils from '../../../../utils/utils';
import {useDispatch} from 'react-redux';
import * as actionsCommon from '../../../../store/common/actions';

export const ComponentWithContextMenu = props => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const {isOwner} = props;
  const {AnchorComponent, removeData, ...restProps} = props;

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  // const removeMessage = useCallback(() => {
  //   try {
  //     firebaseService.removeDocument('messages', docId);
  //     firebaseService.removeDocument('likes', docId);
  //     firebaseService.removeDocument('dislikes', docId);
  //   } catch (error) {
  //     dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
  //   } finally {
  //     setVisible(false);
  //   }
  // }, []);

  const removeMessage = useCallback(async () => {
    await removeData();
    setVisible(false);
  }, []);

  return (
    <Menu
      visible={visible}
      animationDuration={200}
      anchor={<AnchorComponent showMenu={showMenu} {...restProps} />}>
      <MenuItem textStyle={styles.title}>Delete ?</MenuItem>
      <MenuDivider />

      <View style={styles.menuItemContent}>
        <Icon
          type="material-community"
          name="delete-off"
          color="green"
          onPress={hideMenu}
        />
        <Icon
          type="material-community"
          name="delete"
          color={isOwner ? 'red' : 'gray'}
          onPress={isOwner ? removeMessage : null}
        />
      </View>
    </Menu>
  );
};

const styles = StyleSheet.create({
  menuItemContent: {
    width: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },

  title: {
    alignSelf: 'center',
  },
});
