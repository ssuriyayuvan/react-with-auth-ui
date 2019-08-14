import axios from 'axios';
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  auth,
  facebookAuthProvider,
  githubAuthProvider,
  googleAuthProvider,
  twitterAuthProvider
} from "../../firebase/firebase";
import {
  SIGNIN_FACEBOOK_USER,
  SIGNIN_GITHUB_USER,
  SIGNIN_GOOGLE_USER,
  SIGNIN_TWITTER_USER,
  SIGNIN_USER,
  SIGNOUT_USER,
  SIGNUP_USER,
  FORGOT_PASSWORD_USER,
} from "constants/ActionTypes";
import { showAuthMessage, userSignInSuccess, userSignOutSuccess, userSignUpSuccess, forgotPasswordUserSuccess } from "../../appRedux/actions/Auth";
import {
  userFacebookSignInSuccess,
  userGithubSignInSuccess,
  userGoogleSignInSuccess,
  userTwitterSignInSuccess
} from "../actions/Auth";

const API_URL = 'https://atskill-node-auth-app.herokuapp.com/';

const createUserWithEmailPasswordRequest = async (email, password, companyName, fullName) =>
  await axios.post(`${API_URL}company/registration`, { email, password, fullname: fullName, companyname: companyName, plan: 1 })
    .then(authUser => authUser.data)
    .catch(error => error);

const signInUserWithEmailPasswordRequest = async (email, password) =>
  await axios.post(`${API_URL}login/`, { email, password })
    .then(authUser => authUser.data)
    .catch(error => error);

const signOutRequest = async () =>
  await auth.signOut()
    .then(authUser => authUser)
    .catch(error => error);

const forgotPasswordWithEmailRequest = async email =>
  await axios.post(`${API_URL}resetpwd/`, { email })
    .then(status => status)
    .catch(error => error);


const signInUserWithGoogleRequest = async () =>
  await auth.signInWithPopup(googleAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);

const signInUserWithFacebookRequest = async () =>
  await auth.signInWithPopup(facebookAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);

const signInUserWithGithubRequest = async () =>
  await auth.signInWithPopup(githubAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);

const signInUserWithTwitterRequest = async () =>
  await auth.signInWithPopup(twitterAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);

function* createUserWithEmailPassword({ payload }) {
  const { email, password, companyName, fullName } = payload;
  try {
    const signUpUser = yield call(createUserWithEmailPasswordRequest, email, password, companyName, fullName);
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      localStorage.setItem('user_id', signUpUser.user.uid);
      yield put(userSignUpSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithGoogle() {
  try {
    const signUpUser = yield call(signInUserWithGoogleRequest);
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      localStorage.setItem('user_id', signUpUser.user.uid);
      yield put(userGoogleSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}


function* signInUserWithFacebook() {
  try {
    const signUpUser = yield call(signInUserWithFacebookRequest);
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      localStorage.setItem('user_id', signUpUser.user.uid);
      yield put(userFacebookSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}


function* signInUserWithGithub() {
  try {
    const signUpUser = yield call(signInUserWithGithubRequest);
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message));
    } else {
      localStorage.setItem('user_id', signUpUser.user.uid);
      yield put(userGithubSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}


function* signInUserWithTwitter() {
  try {
    const signUpUser = yield call(signInUserWithTwitterRequest);
    if (signUpUser.message) {
      if (signUpUser.message.length > 100) {
        yield put(showAuthMessage('Your request has been canceled.'));
      } else {
        yield put(showAuthMessage(signUpUser.message));
      }
    } else {
      localStorage.setItem('user_id', signUpUser.user.uid);
      yield put(userTwitterSignInSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithEmailPassword({ payload }) {
  const { email, password } = payload;
  try {
    const signInUser = yield call(signInUserWithEmailPasswordRequest, email, password);
    if (signInUser.user) {
      yield put(showAuthMessage(signInUser.user));
    } else {
      localStorage.setItem('token', signInUser.token);
      yield put(userSignInSuccess(signInUser.token));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signOut() {
  try {
    const signOutUser = yield call(signOutRequest);
    if (signOutUser === undefined) {
      localStorage.removeItem('user_id');
      yield put(userSignOutSuccess(signOutUser));
    } else {
      yield put(showAuthMessage(signOutUser.message));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* forgotPasswordWithEmail({ payload }) {
  const { email } = payload;
  try {
    const response = yield call(forgotPasswordWithEmailRequest, email);
    if (response.status === 200) {
      yield put(forgotPasswordUserSuccess(true));
    } else {
      yield put(userSignOutSuccess(response));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

export function* createUserAccount() {
  yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
}

export function* signInWithGoogle() {
  yield takeEvery(SIGNIN_GOOGLE_USER, signInUserWithGoogle);
}

export function* signInWithFacebook() {
  yield takeEvery(SIGNIN_FACEBOOK_USER, signInUserWithFacebook);
}

export function* signInWithTwitter() {
  yield takeEvery(SIGNIN_TWITTER_USER, signInUserWithTwitter);
}

export function* signInWithGithub() {
  yield takeEvery(SIGNIN_GITHUB_USER, signInUserWithGithub);
}

export function* signInUser() {
  yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signOutUser() {
  yield takeEvery(SIGNOUT_USER, signOut);
}

export function* forgotPasswordUser() {
  yield takeEvery(FORGOT_PASSWORD_USER, forgotPasswordWithEmail);
}

export default function* rootSaga() {
  yield all([fork(signInUser),
  fork(createUserAccount),
  fork(signInWithGoogle),
  fork(signInWithFacebook),
  fork(signInWithTwitter),
  fork(signInWithGithub),
  fork(signOutUser),
  fork(forgotPasswordUser)]);
}
