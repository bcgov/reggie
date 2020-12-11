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
// Created by Shelly Xue Han on 2019-01-16.
//

import config from './config.json';

export const APP_INFO = {
  NAME: 'Rocket.Chat Invitation App',
  DISPLAY_NAME: 'Rocket.Chat Invitation App',
};

export const API = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL
    ? `https://${process.env.REACT_APP_API_BASE_URL}/api/v1/`
    : `https://${config.apiBaseUrl}/api/v1/`,
  GET_SSO_USER: userId => `sso/user/${userId}`,
  INVITE_USER: userId => `sso/user/invite/${userId}`,
  VERIFY_SSO_USER: userId => `sso/user/verify/${userId}`,
  TIME_OUT: 40000,
};

export const SSO_CONFIG = {
  baseURL: process.env.REACT_APP_SSO_BASE_URL || config.ssoBaseUrl,
  realmName: process.env.REACT_APP_SSO_REALM_NAME || config.ssoRealmName,
  clientId: process.env.REACT_APP_SSO_CLIENT_ID || config.ssoClientId,
  kcIDPHint: null,
};

export const SSO_IDP = {
  GITHUB: 'github',
  IDIR: 'idir',
};

export const SELF_SERVER_APP = {
  ROCKETCHAT: {
    URL: process.env.REACT_APP_ROCKETCHAT_URL || config.rocketchatUrl,
    NAME: 'rc',
    INVITATION_CODE: 'rc',
  },
  REGGIE: {
    README:
      'https://developer.gov.bc.ca/Community-Enablers-and-Events/Steps-to-join-Pathfinder-Rocket.Chat',
  },
};

export const ROUTES = {
  EMAIL: {
    VERIFY: 'invite',
  },
};

export const AUTH_CODE = {
  NEW: 'new',
  AUTHORIZED: 'authorized',
  PENDING: 'pending',
};

export const SCROLLER = {
  CONFIG: {
    duration: 800,
    delay: 80,
    smooth: true,
    offset: 50,
  },
  TARGET: 'scorllerTarget',
};

export const ERROR_MESSAGES = {
  INCOMPLETE_ACCOUNT:
    'Your DevHub KeyCloak account profile is incomplete, please update your profile by closing the browser and login again.',
};
