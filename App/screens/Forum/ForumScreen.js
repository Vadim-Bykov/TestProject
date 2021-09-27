import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useMemo,
} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  FlatList,
  useWindowDimensions,
  Keyboard,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import {BASE_IMAGE_URL, COLORS, DEFAULT_MOVIE_IMAGE} from '../../consts/consts';
import * as firebaseService from '../../api/firebaseService';
import * as utils from '../../utils/utils';
import * as actionsCommon from '../../store/common/actions';
import * as selectorsCommon from '../../store/auth/selectors';
import {MessageInput} from './components/MessageInput';
import {MessageItem} from './components/Message/MessageItem';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {DeleteForum} from './components/DeleteForum';
import {ComponentWithContextMenu} from './components/Message/ComponentWithContextMenu';

export const ForumScreen = ({navigation, route}) => {
  const dispatch = useDispatch;
  const [messages, setMessages] = useState();
  const userData = useSelector(selectorsCommon.getUserData);
  const {forumId, posterUrl, creatorId} = route.params;
  const {colors, dark} = useTheme();
  const {height, width} = useWindowDimensions();
  const bgScale = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const isForumOwner = useMemo(() => creatorId === userData.uid, []);

  const removeForum = useCallback(async () => {
    try {
      // firebaseService.removeDocument('forums', forumId);
      firebaseService.massDocsDelete('messages', forumId, 'forumId');
      firebaseService.massDocsDelete('likes', forumId, 'forumId');
      firebaseService.massDocsDelete('dislikes', forumId, 'forumId');
    } catch (error) {
      dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
    } finally {
      navigation.goBack();
    }
    console.log('Forum delete.');
  }, []);

  useLayoutEffect(() => {
    if (isForumOwner) {
      navigation.setOptions({
        headerRight: () => (
          <ComponentWithContextMenu
            isOwner={isForumOwner}
            removeData={removeForum}
            AnchorComponent={DeleteForum}
          />
        ),
      });
    }
  }, []);

  const animateBackground = useCallback(() => {
    Animated.spring(bgScale, {
      toValue: 1,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const onResult = useCallback(querySnapshot => {
    const tempStore = [];
    if (querySnapshot.empty) return;

    querySnapshot.docs.forEach(document => tempStore.push(document.data()));
    setMessages(utils.sortByTime(tempStore));
  }, []);

  console.log(messages);

  const onError = useCallback(error => {
    dispatch(actionsCommon.setError(utils.extractErrorMessage(error)));
  }, []);

  useEffect(() => {
    const subscriber = firebaseService.observeCollectionItems(
      'messages',
      'forumId',
      forumId,
      onResult,
      onError,
    );

    return subscriber;
  }, []);

  const scrollToEnd = useCallback(() => {
    messages?.length && flatListRef?.current?.scrollToEnd();
  }, [flatListRef, messages]);

  useEffect(() => {
    const subscriber = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(scrollToEnd, 500);
      // flatListRef.current.scrollToEnd()
    });

    return subscriber.remove;
  }, [flatListRef, messages]);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <MessageItem
          messages={messages}
          item={item}
          index={index}
          currentUserId={userData?.uid}
          currentUserPhotoUrl={userData?.photoURL}
          width={width}
          themeColors={colors}
        />
      );
    },
    [width, messages, dark],
  );

  // const {bottom} = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <>
      {/* <KeyboardAvoidingView
        style={[styles.container]}
        behavior="padding"
        keyboardVerticalOffset={tabBarHeight + 13}
        enabled={Platform.select({ios: true, android: false})}> */}
      <Animated.Image
        source={{
          uri: posterUrl
            ? `${BASE_IMAGE_URL}original${posterUrl}`
            : DEFAULT_MOVIE_IMAGE,
        }}
        blurRadius={10}
        onLoadEnd={animateBackground}
        style={[styles.imageBackGround, {transform: [{scale: bgScale}]}]}
      />

      <LinearGradient
        colors={['transparent', colors.background]}
        style={styles.linearGradient}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.timestamp.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToEnd}
      />

      <MessageInput forumId={forumId} userId={userData?.uid} />
      {/* </View> */}
      {/* </KeyboardAvoidingView> */}
      {Platform.OS === 'ios' && <KeyboardSpacer topSpacing={-tabBarHeight} />}
    </>
  );
};

const styles = StyleSheet.create({
  imageBackGround: {
    position: 'absolute',
    ...StyleSheet.absoluteFill,
  },

  container: {
    flex: 1,
  },

  flatListContainer: {
    flexGrow: 1,
  },

  linearGradient: {
    position: 'absolute',
    ...StyleSheet.absoluteFill,
  },
});
