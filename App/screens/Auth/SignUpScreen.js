import React, {useCallback} from 'react';

import {AuthPage} from './components/AuthPage';

export const SignUpScreen = ({navigation}) => {
  const goToSignIn = useCallback(() => navigation.navigate('SignIn'));

  return <AuthPage isSignUp={true} redirectTo={goToSignIn} />;
};
