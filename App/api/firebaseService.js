import auth from '@react-native-firebase/auth';
import * as actionsAuth from '../store/auth/actions';
import * as actionsCommon from '../store/common/actions';
import {extractErrorMessage} from '../utils/utils';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
//for Google SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25

const uploadPhoto = async (fileName, uri) => {
  try {
    const reference = await storage().ref(fileName);

    await reference.putFile(uri);

    const photoUrl = reference.getDownloadURL();

    return photoUrl;
  } catch (error) {
    Promise.reject(error);
  }
};

const saveUserData = ({uid, photoURL, displayName, email}) => {
  try {
    firestore().collection('users').doc(uid).set({
      displayName,
      email,
      photoURL,
      uid,
    });
  } catch (error) {
    Promise.reject(error);
  }
};

export const setUserDataBase =
  ({displayName, email, uid, photoURL}) =>
  async dispatch => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .set({
        displayName,
        email,
        uid,
        photoURL,
      })
      .catch(error => {
        console.error(error);

        dispatch(actionsCommon.setError(extractErrorMessage(error)));
      });
  };

export const signUp = userData => async dispatch => {
  const {email, password, userName, fileName, uri} = userData;

  dispatch(actionsCommon.setIsFetching(true));

  try {
    const userCredentials = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );

    const photoURL = fileName && uri ? await uploadPhoto(fileName, uri) : null;

    if (userCredentials) {
      await userCredentials.user.updateProfile({
        displayName: userName,
        photoURL,
      });
    }

    const user = await auth().currentUser;

    await saveUserData({
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });

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

    dispatch(actionsAuth.setUserData(null));
  } catch (error) {
    // console.error(error);

    dispatch(actionsCommon.setError(extractErrorMessage(error)));
  } finally {
    dispatch(actionsCommon.setIsFetching(false));
  }
};

export const updateUserProfile = userData => async dispatch => {
  dispatch(actionsCommon.setIsFetching(true));

  const {currentEmail, newEmail, photoURL, userName, password, fileName} =
    userData;

  const isLocalPhoto = photoURL.includes('file:/');

  try {
    newEmail &&
      (await auth().signInWithEmailAndPassword(currentEmail, password));

    const newUrl = isLocalPhoto ? await uploadPhoto(fileName, photoURL) : null;

    await Promise.all([
      auth().currentUser.updateProfile({
        displayName: userName,
        photoURL: newUrl || photoURL || null,
      }),
      newEmail && auth().currentUser.updateEmail(newEmail),
    ]);

    const user = await auth().currentUser;

    await saveUserData(user);

    dispatch(actionsAuth.setUserData(user));

    return true;
  } catch (error) {
    // console.error(error);

    dispatch(actionsCommon.setError(extractErrorMessage(error)));
  } finally {
    dispatch(actionsCommon.setIsFetching(false));
  }
};
