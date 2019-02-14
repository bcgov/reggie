//
// Reggie
//
// Copyright © 2019 Province of British Columbia
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
// Created by Shelly Xue Han on 2019-02-12.
//

'use strict';

export const SSO_USER = {
  URL: 'https://sso-user-url',
  USERNAME: 'user',
  PASSWORD: 'password1',
  TOKEN: '123',
};

export const SSO_ACCOUNT = {
  EMAIL: 'email-address',
  FIRST: 'user',
  LAST: 'password1',
};

export const SSO_SA = {
  URL: 'https://sso-sa-url',
  USERNAME: 'sa-user',
  PASSWORD: 'password1',
  TOKEN: '123',
};

export const SSO_USERS = {
  USER1: {
    email: SSO_ACCOUNT.EMAIL,
    firstName: SSO_ACCOUNT.FIRST,
    lastName: SSO_ACCOUNT.LAST,
  },
  USER2: {
    firstName: SSO_ACCOUNT.FIRST,
    lastName: SSO_ACCOUNT.LAST,
  },
  USER3: {
    email: SSO_ACCOUNT.EMAIL,
    firstName: SSO_ACCOUNT.FIRST,
    lastName: SSO_ACCOUNT.LAST,
    idp: SSO_ACCOUNT.IDP,
    group: SSO_ACCOUNT.GROUP,
  },
};

export const SSO_USERS_IDPS = {
  IDP1: [],
  IDP2: [{ identityProvider: 'idir' }],
  IDP3: [{ identityProvider: 'github', userName: 'goodUser' }],
  IDP4: [{ identityProvider: 'github', userName: 'badUser' }],
};
