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

export const TARGET_GITHUB_ORGS = ['org1', 'org2', 'org3'];

export const GH_USERS = {
  TARGET_USER: {
    userId: 'matchedUser',
    response: [
      {
        org: TARGET_GITHUB_ORGS[0],
        membership: true,
      },
      {
        org: TARGET_GITHUB_ORGS[1],
        membership: true,
      },
      {
        org: TARGET_GITHUB_ORGS[2],
        membership: false,
      },
    ],
  },
  OTHER_USER: {
    userId: 'otherUser',
    response: [
      {
        org: TARGET_GITHUB_ORGS[2],
        membership: false,
      },
    ],
  },
};
