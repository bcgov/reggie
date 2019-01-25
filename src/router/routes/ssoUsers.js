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
import { SSO_SUB_URI, SSO_REQUEST, SSO_GROUPS, EMAIL_REQUEST } from '../../constants';
import {
  getSAToken,
  getUserInfoByEmail,
  getUserInfoById,
  checkSSOGroup,
  updateUser,
  checkUserAuthStatus,
  addUserToGroup,
  removeUserFromGroup,
} from '../../libs/sso-utils';
import { sendConfirmationEmail, sendInvitationEmail, verifyToken } from '../../libs/email-utils';

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
    const SACredentials = config.get(SSO_REQUEST.SA_CREDENTIAL_NAME);
    try {
      const SAToken = await getSAToken(SACredentials);
      const SSOCredentials = {
        uri: `${process.env.SSO_HOST_URL}/${SSO_SUB_URI.REALM_ADMIN}/${process.env.SSO_REALM}/`,
        token: SAToken,
      };
      const userProfile = await getUserInfoByEmail(SSOCredentials, email);
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
    const SACredentials = config.get(SSO_REQUEST.SA_CREDENTIAL_NAME);
    try {
      const SAToken = await getSAToken(SACredentials);
      const SSOCredentials = {
        uri: `${process.env.SSO_HOST_URL}/${SSO_SUB_URI.REALM_ADMIN}/${process.env.SSO_REALM}/`,
        token: SAToken,
      };
      const userProfile = await getUserInfoById(SSOCredentials, userId);
      const userStatus = await checkUserAuthStatus(userProfile);

      return res.status(200).json({ ...userProfile, ...userStatus });
    } catch (error) {
      const message = `Unable to get SSO user with ID ${userId}`;
      logger.error(`${message}, err = ${error.message}`);
      throw errorWithCode(`${message}, err = ${error.message}`, 500);
    }
  })
);

// Update SSO user profile and send confirmation email:
router.put(
  '/user/:userId',
  asyncMiddleware(async (req, res) => {
    const { userId } = req.params;
    const userProfile = req.body;

    if (!userId) {
      throw errorWithCode('Please provide the ID of the SSO user you are updating.', 400);
    }

    if (!userProfile.email || !userProfile.firstName || !userProfile.lastName) {
      throw errorWithCode('Missing Email, firstName or lastName to update the SSO user', 400);
    }
    const userInfo = {
      id: userId,
      email: userProfile.email,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
    };

    logger.info(`Updating user of ${userId}`);
    const SACredentials = config.get(SSO_REQUEST.SA_CREDENTIAL_NAME);
    const emailServerConfig = config.get(EMAIL_REQUEST.EMAIL_CONFIG_NAME);
    try {
      const SAToken = await getSAToken(SACredentials);
      const SSOCredentials = {
        uri: `${process.env.SSO_HOST_URL}/${SSO_SUB_URI.REALM_ADMIN}/${process.env.SSO_REALM}/`,
        token: SAToken,
      };
      // Update SSO user profile:
      logger.info('- Updating user profile');
      await updateUser(SSOCredentials, userInfo);
      // Assingn SSO user to group:
      logger.info('- Updating user group');
      await addUserToGroup(SSOCredentials, userId, SSO_GROUPS.PENDING);
      // Send out confirmation email to the updated email adderss:
      logger.info('- Email user');
      await sendConfirmationEmail(emailServerConfig, userInfo);

      return res.status(200).end();
    } catch (error) {
      const message = `Unable to update SSO user with ID ${userId}`;
      logger.error(`${message}, err = ${error.message}`);
      throw errorWithCode(`${message}, err = ${error.message}`, 500);
    }
  })
);

// Confirm SSO user email and update authorization status:
router.put(
  '/user/confirmed/:userId',
  asyncMiddleware(async (req, res) => {
    const { userId } = req.params;
    const { userEmail, token } = req.body;

    if (!userId) {
      throw errorWithCode('Please provide the ID of the SSO user you are updating.', 400);
    }

    logger.info(`Check email confirm user of ${userId}`);
    const SACredentials = config.get(SSO_REQUEST.SA_CREDENTIAL_NAME);
    try {
      const SAToken = await getSAToken(SACredentials);
      const SSOCredentials = {
        uri: `${process.env.SSO_HOST_URL}/${SSO_SUB_URI.REALM_ADMIN}/${process.env.SSO_REALM}/`,
        token: SAToken,
      };
      // Verify if email of user matches:
      logger.info('- Verify token');
      const tokenEmail = await verifyToken(token, process.env.EMAIL_CONFIRMATION_JWT_SECRET);
      logger.info(tokenEmail);
      if (tokenEmail === userEmail) {
        // check if user has been in the groups:
        const isPending = await checkSSOGroup(SSOCredentials, userId, [SSO_GROUPS.PENDING]);
        const isRegistered = await checkSSOGroup(SSOCredentials, userId, [SSO_GROUPS.REGISTERED]);
        if (isPending) {
          logger.info('- Authorizing user');
          // Remove SSO user from pending group:
          await removeUserFromGroup(SSOCredentials, userId, SSO_GROUPS.PENDING);
          // Assingn SSO user to group:
          await addUserToGroup(SSOCredentials, userId, SSO_GROUPS.REGISTERED);
          return res.status(200).end();
        }
        if (!isPending && isRegistered) {
          logger.info('- Authorized user already');
          return res.status(200).end();
        }
      }
      logger.info('- User not following the required authorization flow');
      return res.status(404).json('Unsuccessful confirmation of the current user');
    } catch (error) {
      const message = `Unable to update SSO user with ID ${userId}`;
      logger.error(`${message}, err = ${error.message}`);
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

    if (!newUser.email || !newUser.code) {
      throw errorWithCode('Missing Email and invitation code', 400);
    }

    logger.info(`Inviting new user of ${newUser.email}`);
    // TODO: check user's authorization status
    // const SACredentials = config.get(SSO_REQUEST.SA_CREDENTIAL_NAME);
    const emailServerConfig = config.get(EMAIL_REQUEST.EMAIL_CONFIG_NAME);
    try {
      // const SAToken = await getSAToken(SACredentials);
      // const SSOCredentials = {
      //   uri: `${process.env.SSO_HOST_URL}/${SSO_SUB_URI.REALM_ADMIN}/${process.env.SSO_REALM}/`,
      //   token: SAToken,
      // };
      // logger.info('- Check user access');
      // const userProfile = await getUserInfoById(SSOCredentials, userId);
      // const userStatus = await checkUserAuthStatus(userProfile);

      // Send out invitation email to the target email adderss:
      logger.info('- Email user');
      await sendInvitationEmail(emailServerConfig, newUser.email, newUser.code);

      return res.status(200).end();
    } catch (error) {
      const message = 'Unable to send out invitation';
      logger.error(`${message}, err = ${error.message}`);
      throw errorWithCode(`${message}, err = ${error.message}`, 500);
    }
  })
);

module.exports = router;
