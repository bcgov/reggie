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
import { SSO_GROUPS, EMAIL_REQUEST } from '../../constants';
import {
  getUserInfoByEmail,
  getUserInfoById,
  checkUserAuthStatus,
  addUserToGroup,
} from '../../libs/sso-utils';
import { sendInvitationEmail, verifyToken } from '../../libs/email-utils';

const router = new Router();

// Get SSO user by email:
router.get(
  '/user',
  asyncMiddleware(async (req, res) => {
    const { email } = req.query;

    if (!email) {
      throw errorWithCode('Please provide the email of the SSO user you are looking for.', 400);
    }

    logger.info(`Looking of user of ${email}`);
    try {
      const userProfile = await getUserInfoByEmail(email);
      const userStatus = await checkUserAuthStatus(userProfile);

      return res.status(200).json({ ...userProfile, ...userStatus });
    } catch (error) {
      const message = `Unable to get SSO user with email ${email}`;
      logger.error(`${message}, err = ${error.message}`);
      throw errorWithCode(`${message}, err = ${error.message}`, 500);
    }
  })
);

// Get SSO user by ID:
router.get(
  '/user/:userId',
  asyncMiddleware(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
      throw errorWithCode('Please provide the ID of the SSO user you are looking for.', 400);
    }

    logger.info(`Looking of user of ${userId}`);
    try {
      const userProfile = await getUserInfoById(userId);
      const userStatus = await checkUserAuthStatus(userProfile);

      return res.status(200).json({ ...userProfile, ...userStatus });
    } catch (error) {
      // Log error first for record then send out error response:
      const message = `Unable to get SSO user with ID ${userId}`;
      logger.error(`${message}, err = ${error.message}`);
      if (error.code === 404) throw errorWithCode(error.message, 404);
      throw errorWithCode(`${message}, err = ${error.message}`, 500);
    }
  })
);

// Invite new user with email:
router.post(
  '/user/invite/:userId',
  asyncMiddleware(async (req, res) => {
    const { userId } = req.params;
    const newUser = req.body;

    if (!userId) {
      throw errorWithCode('Please provide a authorized user ID to invite new user.', 400);
    }

    if (!newUser.email || !newUser.code || !newUser.refUrl) {
      throw errorWithCode('Missing Email and invitation code, or web url', 400);
    }

    // NOTE: keeping track of invitation sent as stdout for now
    console.log(`User ${userId} is inviting new user with ${newUser.email}`);
    logger.error(`----INFO: User ${userId} is inviting new user with ${newUser.email}`);
    // logger.info(`Inviting new user of ${newUser.email}`);
    // TODO: check user's authorization status
    const emailServerConfig = config.get(EMAIL_REQUEST.EMAIL_CONFIG_NAME);
    try {
      // Send out invitation email to the target email adderss:
      logger.info('- Email user');
      await sendInvitationEmail(emailServerConfig, newUser.email, newUser.code, newUser.refUrl);

      return res.status(200).end();
    } catch (error) {
      const message = 'Unable to send out invitation';
      logger.error(`${message}, err = ${error.message}`);
      throw errorWithCode(`${message}, err = ${error.message}`, 500);
    }
  })
);

// Verify invitation email and code pair, join group if matching:
router.put(
  '/user/verify/:userId',
  asyncMiddleware(async (req, res) => {
    const { userId } = req.params;
    const verifyBody = req.body;

    if (!userId) {
      throw errorWithCode('Please provide SSO user ID.', 400);
    }

    if (!verifyBody.email || !verifyBody.code || !verifyBody.token) {
      throw errorWithCode('Missing Email, Code, or Token', 400);
    }

    logger.info(`Verifying email and invitation code for ${userId}`);
    try {
      // Verify if email of user matches:
      logger.info('- Verify token');
      const tokenData = await verifyToken(
        verifyBody.token,
        process.env.EMAIL_INVITATION_JWT_SECRET
      );

      if (tokenData.code !== verifyBody.code) {
        logger.info('- Invitation code not matching');
        return res.status(400).send('Invalid invitation link');
      } else if (tokenData.email.toLowerCase() !== verifyBody.email.toLowerCase()) {
        logger.info('- User account email does not match the invitation');
        return res.status(400).send('Account email does not match the invitation');
      } else {
        // Assign SSO user to group:
        await addUserToGroup(userId, SSO_GROUPS.INVITED);
        return res.status(200).end();
      }
    } catch (error) {
      const message = `Unable to verify the invitation for ${userId}`;
      logger.error(`${message}, err = ${error.message}`);
      throw errorWithCode(`${message}, err = ${error.message}`, 500);
    }
  })
);

module.exports = router;
