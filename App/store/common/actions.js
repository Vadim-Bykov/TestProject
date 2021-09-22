import * as actionTypes from './actionType';

export const setIsFetching = isFetching => ({
  type: actionTypes.COMMON_SET_IS_FETCHING,
  isFetching,
});

export const setError = error => ({
  type: actionTypes.COMMON_SET_ERROR,
  error,
});

export const setColorScheme = colorScheme => ({
  type: actionTypes.COMMON_SET_COLOR_SCHEME,
  colorScheme,
});
