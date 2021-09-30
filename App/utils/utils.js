import {useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COMMON_ERROR_MESSAGE} from '../consts/consts';
import {SPACING} from '../screens/Home/HomeScreen';

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

export const cutStringToSize = (string, size) =>
  string.length > size ? `${string.slice(0, size - 1)}...` : string;

export const getHomePagerDimensions = () => {
  const {width, height} = useWindowDimensions();
  const {top, left, right} = useSafeAreaInsets();

  const isLandScape = width > height;

  const FLAT_LIST_WINDOW_WIDTH = width - SPACING * 2 - left - right;
  const PORTRAIT_SLIDES_COUNT = 1;
  const ITEM_HEIGHT = isLandScape
    ? height - top - 60 - SPACING * 2 // 60 - bottomTabNavigator height
    : (FLAT_LIST_WINDOW_WIDTH / PORTRAIT_SLIDES_COUNT) * 1.35;
  const LANDSCAPE_SLIDES_COUNT = Math.floor(
    (FLAT_LIST_WINDOW_WIDTH / ITEM_HEIGHT) * 1.5,
  );
  // const LANDSCAPE_SLIDES_COUNT = 3;

  const SHOWN_SLIDES_COUNT = isLandScape
    ? LANDSCAPE_SLIDES_COUNT
    : PORTRAIT_SLIDES_COUNT;
  const ITEM_WIDTH = Math.floor(FLAT_LIST_WINDOW_WIDTH / SHOWN_SLIDES_COUNT);
  // const SIDE_SPACER_WIDTH =
  //   (FLAT_LIST_WINDOW_WIDTH -
  //     (isLandScape ? ITEM_WIDTH * SHOWN_SLIDES_COUNT : ITEM_WIDTH)) /
  //   2;

  return {
    FLAT_LIST_WINDOW_WIDTH,
    ITEM_WIDTH,
    ITEM_HEIGHT,
    width,
    height,
    isLandScape,
  };
};

export const sortByTime = arr =>
  arr.sort((prev, next) => next.timestamp - prev.timestamp);

export const getIsIncludeArray = (array, id) => array.some(item => item === id);
