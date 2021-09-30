import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
// import {io} from 'socket.io-client';

const ws = new WebSocket(
  'wss://social-network.samuraijs.com/handlers/ChatHandler.ashx',
);

// export const instance = axios.create({
//   baseURL: 'https://social-network.samuraijs.com/api/1.0/',
//   withCredentials: true,
//   headers: {
//     'API-KEY': 'a22ee90a-a97a-49d2-a11e-57e1c21f80c5',
//   },
// });

// const loginData = {
//   email: 'bvntaev@gmail.com',
//   password: 'bvntaev1981',
//   rememberMe: true,
//   captcha: null,
// };

const login = loginData =>
  instance.post(`auth/login`, loginData).then(res => console.log(res.data));

export const WebsocketChatScreen = () => {
  const [messages, setMessages] = useState([]);

  console.log(messages);

  useEffect(() => {
    // await login(loginData);

    ws.onopen = () => {
      // connection opened
      ws.send('something'); // send a message
    };

    ws.onmessage = e => {
      // a message was received
      console.log(typeof e.data);
      setMessages([...messages, JSON.parse(e.data)]);
    };

    ws.onerror = e => {
      // an error occurred
      console.log(e.message);
    };

    ws.onclose = e => {
      // connection closed
      console.log(e.code, e.reason);
    };
  }, []);

  const data = messages[0]?.map((message, index) => {
    return (
      <View key={index} style={styles.messageContainer}>
        <FastImage source={{uri: message.photo}} style={styles.userPhoto} />
        <Text>{message.userName}</Text>
        <Text>{message.message}</Text>
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* {data} */}
        <Text>WebsocketChatScreen</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },

  userPhoto: {
    width: 20,
    height: 20,
  },
});
