//
// Reggie Web
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Shelly Xue Han on 2019-01-15.
//

import axios from 'axios';
import {
  authorizationStart,
  authorizationSuccess,
  authorizationError,
  authorizationStop,
  inviteUserStart,
  inviteUserSuccess,
  inviteUserError,
  verifyEmailStart,
  verifyEmailSuccess,
  verifyEmailError,
} from '../actions';
import { API, AUTH_CODE, SELF_SERVER_APP } from '../constants';

const axi = axios.create({
  baseURL: API.BASE_URL,
  timeout: API.TIME_OUT,
  headers: { Accept: 'application/json' },
});

const checkStatus = (isAuthorized = false, isPending = false) => {
  if (isAuthorized) return AUTH_CODE.AUTHORIZED;
  if (isPending) return AUTH_CODE.PENDING;
  return AUTH_CODE.NEW;
};

/**
 * Authorization helper, update authorization states or throw errors
 *
 * @param {String} ssoGroup The targeted SSO group to check aganst
 * @param {String} userId The sso user ID
 *
 */
const _authorizeHelper = async (dispatch, userId, ssoGroup) => {
  let authCode = null;
  let newUserInfo = {};
  try {
    const res = await axi.get(API.GET_SSO_USER(userId));
    authCode = checkStatus(res.data.isAuthorized, res.data.isPending);
    newUserInfo = {
      id: res.data.id,
      email: res.data.email,
      firstName: res.data.firstName,
      lastName: res.data.lastName,
    };
  } catch (error) {
    throw Error(error);
  }
  return dispatch(authorizationSuccess(ssoGroup, newUserInfo, authCode));
};

/**
 * Check user authorization status
 *
 * @param {String} ssoGroup The targeted SSO group to check aganst
 * @param {String} userId The sso user ID
 * @param {Boolean} doStart Dispatch the start action or not, default is yes
 * This is for other action to skip the start process when trying to update authCode
 */
export const authorize = (ssoGroup, userId, doStart = true) => {
  return async (dispatch, getState) => {
    if (doStart) dispatch(authorizationStart());
    try {
      return await _authorizeHelper(dispatch, userId, ssoGroup);
    } catch (err) {
      const message = 'Fail to connect to KeyCloak, please refresh!';
      return dispatch(authorizationError([message]));
    }
  };
};

export const clearAuthorizationProcess = () => {
  return dispatch => {
    dispatch(authorizationStop());
  };
};

// Using a fix code for now as place holder: https://github.com/axios/axios/issues/1104
export const inviteUser = (
  userId,
  email,
  webUrl,
  invitationCode = SELF_SERVER_APP.ROCKETCHAT.INVITATION_CODE
) => {
  return dispatch => {
    dispatch(inviteUserStart());
    axi
      .post(API.INVITE_USER(userId), { email, code: invitationCode, refUrl: webUrl })
      .then(res => {
        return dispatch(inviteUserSuccess());
      })
      .catch(err => {
        const errMsg =
          'Unable to send out invitation to email provided, please double check the email address';
        return dispatch(inviteUserError([errMsg]));
      });
  };
};

export const verifyEmail = (
  userId,
  email,
  jwt,
  invitationCode = SELF_SERVER_APP.ROCKETCHAT.INVITATION_CODE // Same as above
) => {
  return async (dispatch, getState) => {
    dispatch(verifyEmailStart());

    try {
      await axi.put(API.VERIFY_SSO_USER(userId), {
        email,
        code: invitationCode,
        token: jwt,
      });

      // Get the updated the current user info after the API request:
      await _authorizeHelper(dispatch, userId, SELF_SERVER_APP.ROCKETCHAT.NAME);
    } catch (err) {
      const errMsg = 'Your invitation link is invalid, please get invited again';
      return dispatch(verifyEmailError([errMsg]));
    }
    return dispatch(verifyEmailSuccess());
  };
};
