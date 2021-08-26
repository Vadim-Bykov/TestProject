import {CardStyleInterpolators} from '@react-navigation/stack';

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
};
