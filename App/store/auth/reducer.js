import * as actionTypes from './actionType';
import {initialState} from './state';

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SET_USER_DATA:
      return {
        ...state,
        userData: action.userData,
      };

    case actionTypes.AUTH_SET_IS_AUTH:
      return {
        ...state,
        isAuth: action.isAuth,
      };

    default:
      return state;
  }
};
