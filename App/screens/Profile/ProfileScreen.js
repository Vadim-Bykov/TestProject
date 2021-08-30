import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';

export const ProfileScreen = ({navigation}) => {
  return (
    <SafeAreaView>
      <Button title="Edit" onPress={() => navigation.navigate('EditProfile')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
