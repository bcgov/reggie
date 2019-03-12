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
// Created by Shelly Xue Han on 2019-01-08.
//

'use strict';

import { errorWithCode } from '@bcgov/nodejs-common-utils';
import request from 'request-promise-native';
import url from 'url';
import { SSO_SUB_URI, SSO_REQUEST, SSO_CLIENTS, SSO_ROLES } from '../constants';
import checkRocketChatSchema from './rocketchat';
import checkArray from './utils';
import shared from './shared';

/**
 * Setup the options for SSO request
 *
 * @param {String} subUrl The sub url of the request
 * @param {String} httpMethod The request method, default as GET
 * @param {Object} params The query string for request, default as empty object
 * @return {String} The authentication token for SSO SA
 */
export const requestBuilder = async (subUrl = null, httpMethod = 'GET', params = {}) => {
  try {
    const baseUri = `${process.env.SSO_HOST_URL}/${SSO_SUB_URI.REALM_ADMIN}/${
      process.env.SSO_REALM
    }/`;
    const finalUri = subUrl ? url.resolve(baseUri, subUrl) : baseUri;

    return {
      headers: {
        'Content-Type': SSO_REQUEST.CONTENT_TYPE_FORM,
        Authorization: `Bearer ${await shared.ssoSA.accessToken}`,
      },
      uri: finalUri,
      method: httpMethod,
      qs: params,
    };
  } catch (err) {
    throw new Error(err);
  }
};

export const checkCredentialValid = credentials => {
  if (!credentials.uri) {
    throw new Error('A URL must be provided');
  }
  if (!(credentials.token || (credentials.username && credentials.password))) {
    throw new Error('An auth info must be provided, such as username-password pair or token.');
  }
};

export const checkUserProfile = userInfo =>
  !(!userInfo.email || !userInfo.firstName || !userInfo.lastName);

export const getUserID = async email => {
  try {
    const options = await requestBuilder(SSO_SUB_URI.USER, 'GET', { email });

    const res = await request(options);
    const jsonRes = JSON.parse(res);
    return jsonRes[0].id;
  } catch (err) {
    throw new Error(`Cannot find SSO user: ${err}`);
  }
};

/**
 * Fetch list of group the user belongs to
 *
 * @param {String} userId The user ID
 * @return {Array} The array of groups
 */
export const getUserGroups = async userId => {
  try {
    const options = await requestBuilder(`${SSO_SUB_URI.USER}/${userId}/${SSO_SUB_URI.GROUP}`);

    const res = await request(options);
    const jsonRes = JSON.parse(res);
    // Parse the groups of user:
    try {
      return jsonRes.map(i => i.name);
    } catch (e) {
      return [];
    }
  } catch (err) {
    throw new Error(`Cannot find SSO user groups: ${err}`);
  }
};

/**
 * Fetch the ID of client by name
 *
 * @param {String} clientName The client name
 * @return {String} The ID of the client
 */
export const getClientId = async clientName => {
  try {
    const options = await requestBuilder(SSO_SUB_URI.CLIENT);

    const res = await request(options);
    const jsonRes = JSON.parse(res);

    const client = jsonRes.find(i => i.clientId === clientName);

    return client.id;
  } catch (err) {
    throw new Error(`Cannot find client ${clientName}`);
  }
};

/**
 * Fetch the list of Effective roles of user in a client
 * (Get effective realm-level role mappings. This will recurse all composite roles to get the result.)
 *
 * @param {String} userId The user ID
 * @param {String} client The client name
 * @return {Array} The list of role names
 */
export const getUserRoles = async (userId, client) => {
  try {
    const clientId = await getClientId(client);

    const options = await requestBuilder(
      `${SSO_SUB_URI.USER}/${userId}/${SSO_SUB_URI.ROLE}/${SSO_SUB_URI.CLIENT}/${clientId}/${
        SSO_SUB_URI.COMPOSITE_ROLE
      }`
    );
    const res = await request(options);
    const jsonRes = JSON.parse(res);

    // Parse name of roles:
    try {
      return jsonRes.map(i => i.name);
    } catch (e) {
      return [];
    }
  } catch (err) {
    throw new Error(`Cannot find SSO user roles: ${err}`);
  }
};

export const getUserIdps = async userId => {
  try {
    const options = await requestBuilder(`${SSO_SUB_URI.USER}/${userId}/${SSO_SUB_URI.IDP}`);

    const res = await request(options);
    const jsonRes = JSON.parse(res);
    return jsonRes;
  } catch (err) {
    throw new Error(`Cannot find SSO user IDP: ${err}`);
  }
};

export const getUserInfoByEmail = async email => {
  try {
    const options = await requestBuilder(SSO_SUB_URI.USER, 'GET', { email });

    const res = await request(options);
    const userInfoJson = JSON.parse(res);
    if (userInfoJson.length < 1) {
      throw new Error('No such SSO user');
    }
    const ssoUserInfo = userInfoJson[0];
    const groups = await getUserGroups(ssoUserInfo.id);
    // Get roles in specific client:
    const roles = await getUserRoles(ssoUserInfo.id, SSO_CLIENTS.RC);
    const idps = await getUserIdps(ssoUserInfo.id);
    return {
      id: ssoUserInfo.id,
      email: ssoUserInfo.email ? ssoUserInfo.email : null,
      firstName: ssoUserInfo.firstName ? ssoUserInfo.firstName : null,
      lastName: ssoUserInfo.lastName ? ssoUserInfo.lastName : null,
      group: groups,
      role: roles,
      idp: idps,
    };
  } catch (err) {
    throw new Error(`Fail to retrive SSO user infomation: ${err}`);
  }
};

export const getUserInfoById = async id => {
  try {
    const options = await requestBuilder(`${SSO_SUB_URI.USER}/${id}`);

    const res = await request(options);
    const userInfoJson = JSON.parse(res);
    const ssoUserId = userInfoJson.id;
    const groups = await getUserGroups(ssoUserId);
    // Get roles in specific client:
    const roles = await getUserRoles(ssoUserId, SSO_CLIENTS.RC);
    const idps = userInfoJson.federatedIdentities;
    return {
      id: userInfoJson.id,
      email: userInfoJson.email ? userInfoJson.email : null,
      firstName: userInfoJson.firstName ? userInfoJson.firstName : null,
      lastName: userInfoJson.lastName ? userInfoJson.lastName : null,
      group: groups,
      role: roles,
      idp: idps,
    };
  } catch (err) {
    const message = 'Fail to retrive SSO user infomation';
    throw errorWithCode(`${message}, err = ${err}`, 404);
  }
};

export const checkSSOGroup = async (userId, targetGroups = []) => {
  try {
    const groups = await getUserGroups(userId);
    if (checkArray(groups)) {
      const ssoGroupNames = groups.map(i => i.name);
      return ssoGroupNames.some(groupName => targetGroups.indexOf(groupName) >= 0);
    }
    return false;
  } catch (err) {
    throw new Error(`Fail to check SSO user groups: ${err}`);
  }
};

/**
 * Check user account status based on the SSO profile
 *
 * @param {Object} userInfo The sso user profile
 * @param {Boolean} checkSchema If to check aganst the profile schema, default to false
 * @return {Object} As { isPending, isAuthorized, isRejected }
 */
export const checkUserAuthStatus = async (userInfo, checkSchema = false) => {
  const accountStatus = { isPending: false, isAuthorized: false, isRejected: false };

  try {
    // Existing users:
    const isAuthorized = userInfo.role.includes(SSO_ROLES.REGISTERED);

    // if user has complete profile and matches requirement, return the current sso group status:
    if (isAuthorized) {
      // User need to have a valid profile before they become authorized.
      // If not, return status as pending:
      if (!checkUserProfile(userInfo))
        return {
          ...accountStatus,
          ...{
            isPending: true,
          },
        };
      // If user has a valid profile, return the current status:
      return {
        ...accountStatus,
        ...{
          isAuthorized,
        },
      };
    }

    // check if account is not matching the requirments, then reject:
    if (checkSchema) {
      const matchSchema = await checkRocketChatSchema(userInfo);
      if (!matchSchema) return { ...accountStatus, ...{ isRejected: true } };
    }
    return accountStatus;
  } catch (err) {
    throw new Error(`Fail to check SSO user authorization info: ${err}`);
  }
};

/**
 * Check for email duplication in SSO user accouts
 *
 * @param {Object} userInfo The sso user profile
 * @return {Boolean} If email exists with another accout, true. Else, return false
 */
export const checkEmailExists = async userInfo => {
  try {
    const options = await requestBuilder(SSO_SUB_URI.USER, 'GET', { email: userInfo.email });

    const res = await request(options);
    const jsonRes = JSON.parse(res);
    if (jsonRes.length > 0) {
      const ids = jsonRes.map(user => user.id);
      return ids.some(id => id !== userInfo.id);
    }
    return false;
  } catch (err) {
    throw new Error(`Cannot filter SSO user with email, err - ${err}`);
  }
};

export const updateUser = async userInfo => {
  try {
    let options = await requestBuilder(`${SSO_SUB_URI.USER}/${userInfo.id}`, 'PUT');
    options = {
      ...options,
      body: {
        id: userInfo.id,
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
      },
      json: true,
    };

    const res = await request(options);
    return res;
  } catch (err) {
    throw new Error(`Cannot update SSO user profile: ${err}`);
  }
};

export const getGroupID = async groupName => {
  try {
    const options = await requestBuilder(SSO_SUB_URI.GROUP, 'GET', { search: groupName });
    const res = await request(options);
    const groupInfoJson = JSON.parse(res);
    if (groupInfoJson.length < 1) {
      throw new Error('No such SSO group');
    }
    return groupInfoJson[0].id;
  } catch (err) {
    throw new Error(`Cannot find SSO group: ${err}`);
  }
};

export const addUserToGroup = async (userId, groupName) => {
  try {
    // TBD: use group name or ID?
    const groupId = await getGroupID(groupName);
    const subUrl = `${SSO_SUB_URI.USER}/${userId}/${SSO_SUB_URI.GROUP}/${groupId}`;
    const options = await requestBuilder(subUrl, 'PUT');

    const res = await request(options);
    return res;
  } catch (err) {
    throw new Error(`Cannot add SSO user to group: ${err}`);
  }
};

export const removeUserFromGroup = async (userId, groupName) => {
  try {
    // TBD: use group name or ID?
    const groupId = await getGroupID(groupName);
    const subUrl = `${SSO_SUB_URI.USER}/${userId}/${SSO_SUB_URI.GROUP}/${groupId}`;
    const options = await requestBuilder(subUrl, 'DELETE');

    const res = await request(options);
    return res;
  } catch (err) {
    throw new Error(`Cannot remove SSO user from group: ${err}`);
  }
};
