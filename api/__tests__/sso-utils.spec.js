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

// import { default as request } from 'supertest'; // eslint-disable-line
import { checkCredentialValid, checkUserProfile } from '../src/libs/sso-utils';
import { SSO_USER, SSO_USERS } from '../__fixtures__/sso-fixtures';

jest.mock('request-promise-native');

describe('Test checkCredentialValid', () => {
  test('Credential with uri and token / user auth pair should pass', () => {
    const credential1 = {
      uri: SSO_USER.URL,
      username: SSO_USER.USERNAME,
      password: SSO_USER.PASSWORD,
    };
    const credential2 = { uri: SSO_USER.URL, token: SSO_USER.TOKEN };
    expect(() => {
      checkCredentialValid(credential1);
      checkCredentialValid(credential2);
    }).not.toThrow();
  });

  test('Credential expects host url', () => {
    const credential = {
      username: SSO_USER.USERNAME,
      password: SSO_USER.PASSWORD,
    };
    expect(() => {
      checkCredentialValid(credential);
    }).toThrow('A URL must be provided');
  });

  test('Credential expects token or user auth pair', () => {
    const credential = {
      uri: SSO_USER.URL,
      password: SSO_USER.PASSWORD,
    };
    expect(() => {
      checkCredentialValid(credential);
    }).toThrow('An auth info must be provided, such as username-password pair or token.');
  });
});

describe('Test checkUserProfile', () => {
  test('User info must have email and first+last name', () => {
    const user = SSO_USERS.USER1;
    expect(checkUserProfile(user)).toBe(true);
  });

  test('return false if missing any', () => {
    const user = SSO_USERS.USER2;
    expect(checkUserProfile(user)).toBe(false);
  });
});
