import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {ThemeText} from '../../../common/ThemeText';

export const ButtonBlock = ({page, isLoading, totalPages, setPage}) => {
  const goToNextPage = useCallback(() => {
    setPage(prev => (prev < totalPages ? prev + 1 : prev));
  }, [page, totalPages]);

  const goToPrevPage = useCallback(() => {
    setPage(prev => (prev > 1 ? prev - 1 : prev));
  }, [page, totalPages]);

  return (
    <View style={styles.buttonsBlock}>
      <Button
        title="Prev"
        type="outline"
        containerStyle={styles.buttonContainer}
        buttonStyle={[styles.buttonContainer, styles.button]}
        disabled={page === 1 || isLoading}
        onPress={goToPrevPage}
      />

      <ThemeText style={styles.pageNumber}>{page}</ThemeText>

      <Button
        title="Next"
        type="outline"
        containerStyle={styles.buttonContainer}
        buttonStyle={[styles.buttonContainer, styles.button]}
        disabled={page === totalPages || isLoading}
        onPress={goToNextPage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsBlock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
  },

  buttonContainer: {
    borderRadius: 15,
  },

  button: {
    borderWidth: 1,
  },

  pageNumber: {
    fontSize: 20,
  },
});
