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
// Created by Shelly Xue Han on 2019-01-15.
//

'use strict';

import request from 'request-promise-native';
import { logger } from '@bcgov/nodejs-common-utils';
import shared from './shared';

export const getGithubOrgs = async ghUserId => {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await shared.sso.accessToken}`,
    },
    method: 'GET',
    uri: process.env.RM_HOST,
    body: { userId: ghUserId },
    json: true,
  };

  try {
    // const orgArray = await request(options);
    // if (orgArray.length < 1) {
    //   return [];
    // }
    // const orgNames = orgArray.filter(i => i.membership).map(j => j.org);
    // return orgNames;
    console.log('------------------------options');
    // console.log(options);
    return ['kkk', 'abc'];
  } catch (err) {
    const message = `Unable to request from Repo Mountie for ${ghUserId}`;
    logger.error(`${message}, err = ${err.message}`);
    return [];
  }
};

export const isUserInOrgs = async (username, targetGhOrgs = []) => {
  try {
    const userOrgs = await getGithubOrgs(username);
    return userOrgs.some(org => targetGhOrgs.indexOf(org) >= 0);
  } catch (err) {
    return false;
  }
};
