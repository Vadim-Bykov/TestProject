import {COMMON_ERROR_MESSAGE} from '../consts/consts';

export const extractErrorMessage = error => {
  let errorMessage = '';
  if (error.userInfo) {
    errorMessage = error.userInfo.message;
  } else if (error.message) {
    errorMessage = error.message;
  } else if (error.response.data.status_message) {
    errorMessage = error.response.data.status_message;
  } else {
    errorMessage = COMMON_ERROR_MESSAGE;
  }

  return errorMessage;
};

export const reverseData = data => {
  if (Array.isArray(data) && data.length) {
    const newData = [...data];
    return newData.reverse();
  } else return null;
};
