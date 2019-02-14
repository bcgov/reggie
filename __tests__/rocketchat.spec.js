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

import checkRocketChatSchema from '../src/libs/rocketchat';
import { isUserInOrgs } from '../src/libs/gh-utils';
import { SSO_USERS_IDPS } from '../__fixtures__/sso-fixtures';

jest.mock('../src/libs/gh-utils');

isUserInOrgs.mockImplementation((username, targetGhOrgs) => username === 'goodUser');

describe('Test checkRocketChatSchema', () => {
  test('when account does not have any idp', async () => {
    const profile = { idp: SSO_USERS_IDPS.IDP1 };
    expect(await checkRocketChatSchema(profile)).toBe(false);
  });

  test('when account has IDIR idp', async () => {
    const profile = { idp: SSO_USERS_IDPS.IDP2 };
    expect(await checkRocketChatSchema(profile)).toBe(true);
  });

  test('when account has GitHub idp, with target org', async () => {
    const profile = { idp: SSO_USERS_IDPS.IDP3 };
    expect(await checkRocketChatSchema(profile)).toBe(true);
  });

  test('when account has GitHub idp, witout target org', async () => {
    const profile = { idp: SSO_USERS_IDPS.IDP4 };
    expect(await checkRocketChatSchema(profile)).toBe(false);
  });
});
