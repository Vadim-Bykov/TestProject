import React, {useEffect, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import * as tmdbService from '../../../api/tmdbService';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import * as actionsCommon from '../../../store/common/actions';
import {useRoute} from '@react-navigation/native';
import {extractErrorMessage} from '../../../utils/utils';
import {COLORS} from '../../../consts/consts';

export const SaveMediaIcon = () => {
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [page, setPage] = useState(1);
  const {mediaType, id} = useRoute().params;
  const queryClient = useQueryClient();

  const {data, isError, isLoading, isFetching, error} = useQuery(
    ['savedMediaList', page],
    () => tmdbService.getList(page),
  );

  useEffect(() => {
    const saved = data?.results.length
      ? data?.results.some(media => media.id === id)
      : false;

    !saved && data?.total_pages > page
      ? setPage(prev => prev + 1)
      : setIsSaved(saved);
  }, [data?.results]);

  useEffect(() => {
    isError &&
      dispatch(actionsCommon.setError(error.response.data.status_message));
  }, [isError]);

  useEffect(() => {
    setDisabled(isLoading || isFetching ? true : false);
  }, [isLoading, isFetching]);

  const mutateList = useMutation(
    () =>
      isSaved
        ? tmdbService.removeMedia(mediaType, id)
        : tmdbService.addMedia(mediaType, id),

    {
      onMutate: async () => {
        setDisabled(true);
        await queryClient.cancelQueries('savedMediaList');
        const prevData = queryClient.cancelQueries('savedMediaList');

        return prevData;
      },

      onError: (error, _, prevData) => {
        queryClient.setQueryData(prevData);

        console.log('error', error);
        console.log('extractErrorMessage', extractErrorMessage(error));
        dispatch(actionsCommon.setError(extractErrorMessage(error)));
      },

      onSuccess: data => {
        console.log(data);
        setIsSaved(prev => !prev);
      },

      onSettled: () => {
        console.log('onSettled');
        queryClient.invalidateQueries('savedMediaList');
      },
    },
  );

  return (
    <>
      <Icon
        type="ionicon"
        name={isSaved ? 'save' : 'save-outline'}
        color="blue"
        disabled={disabled}
        disabledStyle={styles.disabledStyle}
        onPress={mutateList.mutate}
      />
      <Text>{isSaved ? 'Saved' : 'Save'}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  disabledStyle: {
    backgroundColor: COLORS.BG_TRANSPARENT_GRAY,
  },
});
