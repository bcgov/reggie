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
// Created by Shelly Xue Han on 2019-01-22.
//

'use strict';

import { TARGET_GITHUB_ORGS, SSO_IDPS } from '../constants';
import { isUserInOrgs } from './gh-utils';
import checkArray from './utils';

const checkRocketChatSchema = async userInfo => {
  try {
    // if user has idp:
    if (!checkArray(userInfo.idp)) return false;
    // if user has IDIR account:
    if (userInfo.idp.some(idp => idp.identityProvider === SSO_IDPS.IDIR)) return true;
    // if user Github account belonging to target gh orgs:
    const githubIdp = userInfo.idp.filter(idp => idp.identityProvider === SSO_IDPS.GITHUB);
    if (githubIdp.length > 0) {
      const ghUsername = githubIdp[0].userName;
      return await isUserInOrgs(ghUsername, TARGET_GITHUB_ORGS);
    }
    return false;
  } catch (err) {
    throw new Error(`Fail to check aganst Rocket Chat Schema - ${err}`);
  }
};

module.exports = checkRocketChatSchema;
