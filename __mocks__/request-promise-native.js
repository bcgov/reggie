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

/* eslint-disable no-unused-vars */

'use strict';

import { SSO_SA } from '../__fixtures__/sso-fixtures';
import { GH_USERS } from '../__fixtures__/gh-fixtures';

let rpn = jest.genMockFromModule('request-promise-native');

function request(options) {
  let resolveObject = '';
  if (options.uri === SSO_SA.URL) resolveObject = JSON.stringify({ access_token: SSO_SA.TOKEN });
  if (options.uri === process.env.RM_HOST) {
    resolveObject = { statusCode: 404, body: [] };
    if (options.qs.userId === GH_USERS.TARGET_USER.userId)
      resolveObject = { statusCode: 200, body: GH_USERS.TARGET_USER.response };
  }
  return new Promise((resolve, reject) => {
    resolve(resolveObject);
  });
}

rpn = request;

module.exports = rpn;
