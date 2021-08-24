import auth from '@react-native-firebase/auth';
import {extractErrorMessage} from '../utils/utils';

//for Google SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25

export const signUp = async userData => {
  const {email, password, userName} = userData;
  try {
    const userCredentials = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );

    if (userCredentials) {
      await userCredentials.user.updateProfile({displayName: userName});
    }

    const user = await auth().currentUser;

    return user;
  } catch (error) {
    console.error(extractErrorMessage(error));
  }
};

export const signIn = async userData => {
  const {email, password} = userData;
  try {
    await auth().signInWithEmailAndPassword(email, password);

    const user = await auth().currentUser;

    return user;
  } catch (error) {
    console.error(extractErrorMessage(error));
  }
};

export const logout = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    console.error(extractErrorMessage(error));
  }
};
