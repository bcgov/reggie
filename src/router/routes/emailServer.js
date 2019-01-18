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
// Created by Shelly Xue Han on 2019-01-09.
//

/* eslint-env es6 */

'use strict';

import { asyncMiddleware, errorWithCode, logger } from '@bcgov/nodejs-common-utils';
import { Router } from 'express';
import config from '../../config';
import { EMAIL_REQUEST } from '../../constants';
import { sendEmail, generateLinkWithToken } from '../../libs/email-utils';

const router = new Router();

router.post(
  '/send',
  asyncMiddleware(async (req, res) => {
    const { email, emailContent } = req.body;

    if (!email) throw errorWithCode('Please provide the email to send to.', 400);

    logger.info(`Sending email to ${email}`);
    const emailServerConfig = config.get(EMAIL_REQUEST.EMAIL_CONFIG_NAME);
    try {
      const link = await generateLinkWithToken(email, emailContent);
      const msgId = await sendEmail(emailServerConfig, email, link);

      logger.info(`Message sent: ${msgId}`);

      return res.status(200).end();
    } catch (error) {
      const message = `Unable to send email to ${email}`;
      logger.error(`${message}, err = ${error.message}`);
      throw errorWithCode(`${message}, err = ${error.message}`, 500);
    }
  })
);

module.exports = router;
