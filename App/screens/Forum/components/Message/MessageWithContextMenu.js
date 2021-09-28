import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {Menu, MenuDivider, MenuItem} from 'react-native-material-menu';

export const MessageWithContextMenu = props => {
  const [visible, setVisible] = useState(false);
  const {isOwner} = props;
  const {AnchorComponent, removeData, ...restProps} = props;

  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  const removeMessage = useCallback(() => {
    removeData();
    setVisible(false);
  }, [removeData]);

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
