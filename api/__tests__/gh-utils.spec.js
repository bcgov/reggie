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

import { getGithubOrgs, isUserInOrgs } from '../src/libs/gh-utils';
import { GH_USERS, TARGET_GITHUB_ORGS } from '../__fixtures__/gh-fixtures';

jest.mock('request-promise-native');

// Skipping github functions as not using:
describe('Test getGithubOrgs', () => {
  test.skip('when github user belong to target group', async () => {
    const result = [TARGET_GITHUB_ORGS[0], TARGET_GITHUB_ORGS[1]];
    expect(await getGithubOrgs(GH_USERS.TARGET_USER.userId)).toEqual(result);
  });

  test.skip('when github user does not belong to target group', async () => {
    const result = [];
    expect(await getGithubOrgs(GH_USERS.OTHER_USER.userId)).toEqual(result);
  });
});

describe('Test isUserInOrgs', () => {
  test.skip('when github user belong to target group', async () => {
    expect(await isUserInOrgs(GH_USERS.TARGET_USER.userId, TARGET_GITHUB_ORGS)).toBe(true);
  });

  test.skip('when github user does not belong to target group', async () => {
    expect(await isUserInOrgs(GH_USERS.OTHER_USER.userId, TARGET_GITHUB_ORGS)).toBe(false);
  });
});
