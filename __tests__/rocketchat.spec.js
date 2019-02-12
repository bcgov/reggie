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
import { checkRocketChatSchema } from '../src/libs/rocketchat';
import { SSO_USER, SSO_SA, SSO_ACCOUNT } from '../__fixtures__/sso-fixtures';

jest.mock('request-promise-native');

describe.skip('Test checkRocketChatSchema', () => {
  test('when account does not have any idp', () => {
  });

  test('when account has IDIR idp', () => {
  });

  test('when account has GitHub idp, with target org', () => {
  });

  test('when account has GitHub idp, witout target org', () => {
  });
});
