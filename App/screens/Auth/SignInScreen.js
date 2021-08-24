import React, {useCallback} from 'react';
import {AuthPage} from './components/AuthPage';

export const SignInScreen = ({navigation}) => {
  const goToSignUp = useCallback(() => navigation.navigate('SignUp'), []);

  return <AuthPage isSignUp={false} goToAnotherStackScreen={goToSignUp} />;
};
