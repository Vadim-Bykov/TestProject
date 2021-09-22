import React, {useCallback} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {Icon} from 'react-native-elements';
import {useMutation, useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';
import {COLORS} from '../../../consts/consts';
import * as tmdbServices from '../../../api/tmdbService';
import * as commonActions from '../../../store/common/actions';
import {extractErrorMessage} from '../../../utils/utils';
import {Platform} from 'react-native';

export const TopPart = ({
  mediaType,
  id,
  voteAverage,
  scrollToEnd,
  isLastIndex,
  index,
}) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const mutation = useMutation(() => tmdbServices.removeMedia(mediaType, id), {
    onMutate: async () => {
      await queryClient.cancelQueries('savedMediaList');

      // to get necessary query data put all the query keys
      const prevData = queryClient.getQueryData(['savedMediaList', 1]);

      //optimistic update
      // queryClient.setQueriesData('savedMediaList', prev => ({
      //   ...prev,
      //   results: prev.results.filter(item => item.id !== id),
      // }));

      // queryClient.setQueryData({
      //   ...prevData,
      //   results: prevData.results.filter(item => item.id !== id),
      // });

      return prevData;
    },

    onError: (error, _, prevData) => {
      dispatch(commonActions.setError(extractErrorMessage(error)));

      queryClient.setQueryData(prevData);
    },

    onSettled: async () => {
      await queryClient.invalidateQueries('savedMediaList');
      if (Platform.OS === 'android' && isLastIndex) {
        scrollToEnd(index - 1);
      }
    },
  });

  const removeItem = useCallback(() => {
    Alert.alert('Removing of item', 'Are you sure?', [
      {text: 'Cancel'},
      {text: 'Yes', onPress: mutation.mutate},
    ]);
  }, []);

  return (
    <View style={styles.topBlock}>
      <View style={styles.outSideCircle}>
        <View style={styles.insideCircle}>
          <Text style={styles.voteText}>{voteAverage}</Text>
        </View>
      </View>

      <Icon type="antdesign" name="delete" color="red" onPress={removeItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  topBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  outSideCircle: {
    width: 45,
    height: 45,
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.DARK_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
  },

  insideCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.DARK_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
  },

  voteText: {
    color: COLORS.DARK_YELLOW,
    fontWeight: 'bold',
    textShadowColor: COLORS.BG_TRANSPARENT_GRAY,
    textShadowOffset: {height: 0.5, width: 0.5},
    textShadowRadius: 1,
  },
});
