import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  FlatList,
  useWindowDimensions,
  Keyboard,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import {BASE_IMAGE_URL, COLORS, DEFAULT_MOVIE_IMAGE} from '../../consts/consts';
import * as firebaseService from '../../api/firebaseService';
import * as utils from '../../utils/utils';
import * as actionsCommon from '../../store/common/actions';
import * as selectorsCommon from '../../store/auth/selectors';
import {MessageInput} from './components/MessageInput';
import {MessageItem} from './components/Message/MessageItem';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export const ForumScreen = ({route}) => {
  const dispatch = useDispatch;
  const [messages, setMessages] = useState();
  const userData = useSelector(selectorsCommon.getUserData);
  const {forumId, posterUrl} = route.params;
  const {colors, dark} = useTheme();
  const {height, width} = useWindowDimensions();
  const bgScale = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

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

  useEffect(() => {
    const subscriber = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => flatListRef.current.scrollToEnd(), 500);
      // flatListRef.current.scrollToEnd()
    });

    return subscriber.remove;
  }, [flatListRef]);

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

  return (
    <>
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

      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.docId}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* <KeyboardAvoidingView> */}
        <MessageInput forumId={forumId} userId={userData?.uid} />
        {/* </KeyboardAvoidingView> */}
      </View>
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
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  linearGradient: {
    position: 'absolute',
    ...StyleSheet.absoluteFill,
  },
});
