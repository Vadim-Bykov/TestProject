import * as actionTypes from './actionType';

export const setUserData = userData => ({
  type: actionTypes.AUTH_SET_USER_DATA,
  userData,
});

export const setIsAuth = isAuth => ({
  type: actionTypes.AUTH_SET_IS_AUTH,
  isAuth,
});
