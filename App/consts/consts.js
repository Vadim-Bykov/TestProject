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

export const colors = {
  BLACK: '#000000',
  WHITE: '#ffffff',
  BG_TRANSPARENT_GRAY: 'rgba(0,0,0, 0.4)',
  DARK_YELLOW: '#DDBA33',
  BLUE: '#1F80D3',
};
