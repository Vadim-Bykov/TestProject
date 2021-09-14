import {CardStyleInterpolators} from '@react-navigation/stack';

export const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/';

export const DEFAULT_AVATAR =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROZzxwSXuX4cnu0J_5Rry0_Al5RqAafnKT3A&usqp=CAU';

export const DEFAULT_MOVIE_IMAGE =
  'https://target.scene7.com/is/image/Target/GUEST_e684225b-5a68-49b2-8fc3-493e515ef4ca?wid=488&hei=488&fmt=pjpeg';

export const COMMON_ERROR_MESSAGE = 'Something was wrong!';

export const STACK_SCREEN_OPTIONS = {
  transitionSpec: {
    open: {animation: 'spring'},
    close: {animation: 'spring'},
  },
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
};

export const COLORS = {
  BLACK: '#000000',
  WHITE: '#ffffff',
  DARK_YELLOW: '#DDBA33',
  BLUE: '#1F80D3',
  BG_TRANSPARENT_GRAY: 'rgba(0,0,0, 0.4)',
  BG_GENERAL: '#F0F0F0',
};

export const COLORS_LIGHT_THEME = {
  dark: false,
  colors: {
    primary: 'rgb(0, 122, 255)',
    background: 'rgb(242, 242, 242)',
    border: 'rgb(216, 216, 216)',
    card: 'rgb(255, 255, 255)',
    notification: 'rgb(255, 59, 48)',
    text: 'rgb(28, 28, 30)',
    textGray: '#6A6A6A',
    backgroundGray: '#EBEBEB',
    // backgroundBlue: '#CDE6FF',
  },
};

export const COLORS_DARK_THEME = {
  dark: true,
  colors: {
    primary: 'rgb(10, 132, 255)',
    background: 'rgb(1, 1, 1)',
    border: 'rgb(39, 39, 41)',
    card: 'rgb(18, 18, 18)',
    notification: 'rgb(255, 69, 58)',
    text: 'rgb(229, 229, 231)',
    textGray: '#A1A1A1',
    backgroundGray: '#BFBFBF',
    // backgroundBlue: '#ABD2FF',
  },
};
