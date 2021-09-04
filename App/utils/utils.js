import {COMMON_ERROR_MESSAGE} from '../consts/consts';

export const extractErrorMessage = error => {
  let errorMessage = '';
  if (error.userInfo) {
    errorMessage = error.userInfo.message;
  } else if (error.message) {
    errorMessage = error.message;
  } else {
    errorMessage = COMMON_ERROR_MESSAGE;
  }
  return errorMessage;
};
