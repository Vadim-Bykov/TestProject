import auth from '@react-native-firebase/auth';
import * as actionsAuth from '../store/auth/actions';
import * as actionsCommon from '../store/common/actions';
import {extractErrorMessage} from '../utils/utils';

//for Google SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25

export const signUp = userData => async dispatch => {
  const {email, password, userName} = userData;

  dispatch(actionsCommon.setIsFetching(true));

  try {
    const userCredentials = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );

    if (userCredentials) {
      await userCredentials.user.updateProfile({displayName: userName});
    }

    const user = await auth().currentUser;

    dispatch(actionsAuth.setUserData(user));
  } catch (error) {
    // console.error(error);

    dispatch(actionsCommon.setError(extractErrorMessage(error)));
  } finally {
    dispatch(actionsCommon.setIsFetching(false));
  }
};

export const signIn = userData => async dispatch => {
  const {email, password} = userData;

  dispatch(actionsCommon.setIsFetching(true));

  try {
    await auth().signInWithEmailAndPassword(email, password);

    const user = await auth().currentUser;

    dispatch(actionsAuth.setUserData(user));
  } catch (error) {
    dispatch(actionsCommon.setError(extractErrorMessage(error)));
    // console.error(error);
  } finally {
    dispatch(actionsCommon.setIsFetching(false));
  }
};

export const logout = () => async dispatch => {
  dispatch(actionsCommon.setIsFetching(true));

  try {
    await auth().signOut();
  } catch (error) {
    // console.error(error);

    dispatch(actionsCommon.setError(extractErrorMessage(error)));
  } finally {
    dispatch(actionsCommon.setIsFetching(false));
  }
};
