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

    default:
      return state;
  }
};
