//
// Reggie
//
// Copyright © 2018 Province of British Columbia
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
// Created by Shelly Xue Han on 2019-01-08.
//

/* eslint-env es6 */

'use strict';

import { asyncMiddleware, errorWithCode, logger } from '@bcgov/nodejs-common-utils';
import { Router } from 'express';
import config from '../../config';
import { SSO_SUB_URI } from '../../constants';
import { getSAToken, getUserInfo } from '../../libs/sso-utils';

const router = new Router();

router.get(
  '/user',
  asyncMiddleware(async (req, res) => {
    const { email } = req.query;

    if (!email) {
      throw errorWithCode('Please provide the email of the SSO user you are looking for.', 400);
    }

    logger.info(`Looking of user of ${email}`);
    const SACredentials = config.get('ssoSA');
    try {
      const SAToken = await getSAToken(SACredentials);
      const SSOCredentials = {
        uri: `${process.env.SSO_HOST_URL}/${SSO_SUB_URI.REALM_ADMIN}/${process.env.SSO_REALM}/`,
        token: SAToken,
      };
      const userProfile = await getUserInfo(SSOCredentials, email);

      return res.status(200).json(userProfile);
    } catch (error) {
      const message = `Unable to get SSO user with email ${email}`;
      logger.error(`${message}, err = ${error.message}`);
      throw errorWithCode(`${message}, err = ${error.message}`, 500);
    }
  })
);

module.exports = router;
