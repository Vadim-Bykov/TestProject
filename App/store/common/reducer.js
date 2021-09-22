import * as actionTypes from './actionType';
import {initialState} from './state';

export const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.COMMON_SET_IS_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching,
      };

    case actionTypes.COMMON_SET_ERROR:
      return {
        ...state,
        error: action.error,
      };

    case actionTypes.COMMON_SET_COLOR_SCHEME:
      return {
        ...state,
        colorScheme: action.colorScheme,
      };

    default:
      return state;
  }
};
