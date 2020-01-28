//
// Reggie Web
//
// Copyright © 2018 Province of British Columbia
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
// Created by Jason Leach on 2018-08-24.
//

import { combineReducers } from 'redux';
import implicitAuthManager from '../auth';
import { AUTHENTICATION, AUTHORIZATION, INIVITE_USER, VERIFY_EMAIL } from '../actions/actionTypes';
import { AUTH_CODE } from '../constants';

const authentication = (state = { isAuthenticated: false, email: null, userId: null }, action) => {
  switch (action.type) {
    case AUTHENTICATION.SUCCESS:
      return {
        ...state,
        ...{
          isAuthenticated: true,
          email: implicitAuthManager.idToken.data.email,
          userId: implicitAuthManager.idToken.data.sub,
        },
      };
    case AUTHENTICATION.FAILED:
      implicitAuthManager.clearAuthLocalStorage();
      return {
        isAuthenticated: false,
        email: null,
        userId: null,
      };
    default:
      return state;
  }
};

const authorization = (
  state = {
    authCode: AUTH_CODE.NEW,
    isAuthorizing: false,
    userInfo: { id: null, email: null, firstName: null, lastName: null },
    ssoGroup: null,
    errorMessages: [],
  },
  action
) => {
  switch (action.type) {
    case AUTHORIZATION.START:
      return {
        ...state,
        ...{
          authCode: AUTH_CODE.NEW,
          isAuthorizing: true,
          errorMessages: [],
        },
      };
    case AUTHORIZATION.SUCCESS:
      return {
        ...state,
        ...{
          authCode: action.payload.authCode,
          isAuthorizing: false,
          userInfo: action.payload.userInfo,
          ssoGroup: action.payload.ssoGroup,
        },
      };
    case AUTHORIZATION.ERROR:
      return {
        ...state,
        ...{
          authCode: AUTH_CODE.NEW,
          isAuthorizing: false,
          errorMessages: action.payload.errorMessages,
        },
      };
    case AUTHORIZATION.STOP:
      return {
        ...state,
        ...{
          isAuthorizing: false,
          errorMessages: [],
        },
      };
    default:
      return state;
  }
};

const inviteUser = (
  state = { invitationStarted: false, sent: false, errorMessages: [] },
  action
) => {
  switch (action.type) {
    case INIVITE_USER.START:
      return {
        invitationStarted: true,
        sent: false,
        errorMessages: [],
      };
    case INIVITE_USER.SUCCESS:
      return {
        invitationStarted: false,
        sent: true,
        errorMessages: [],
      };
    case INIVITE_USER.ERROR:
      return {
        invitationStarted: false,
        sent: false,
        errorMessages: action.payload.errorMessages,
      };
    default:
      return state;
  }
};

const verifyEmail = (
  state = { verifyStarted: false, verfied: false, errorMessages: [] },
  action
) => {
  switch (action.type) {
    case VERIFY_EMAIL.START:
      return {
        verifyStarted: true,
        verfied: false,
        errorMessages: [],
      };
    case VERIFY_EMAIL.SUCCESS:
      return {
        verifyStarted: false,
        verfied: true,
        errorMessages: [],
      };
    case VERIFY_EMAIL.ERROR:
      return {
        verifyStarted: false,
        verfied: false,
        errorMessages: action.payload.errorMessages,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  authentication,
  authorization,
  inviteUser,
  verifyEmail,
});

export default rootReducer;
