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

import request from 'request-promise-native';
import url from 'url';
import { SSO_SUB_URI, SSO_REQUEST } from '../constants';
import checkRocketChatSchema from './rocketchat';
import checkArray from './utils';

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

export const getSAToken = async credentials => {
  checkCredentialValid(credentials);
  try {
    const options = {
      headers: {
        'Content-Type': SSO_REQUEST.CONTENT_TYPE_FORM,
      },
      auth: {
        user: credentials.username,
        pass: credentials.password,
      },
      uri: credentials.uri,
      method: 'POST',
      form: {
        grant_type: SSO_REQUEST.GRANT_TYPE,
        client_id: SSO_REQUEST.CLIENT_ID,
      },
    };

    const res = await request(options);
    const jsonRes = JSON.parse(res);
    return jsonRes.access_token;
  } catch (err) {
    throw new Error(`Cannot connect to KeyCloak: ${err}`);
  }
};

export const getUserID = async (credentials, email) => {
  checkCredentialValid(credentials);

  try {
    const options = {
      headers: {
        'Content-Type': SSO_REQUEST.CONTENT_TYPE_FORM,
        Authorization: `Bearer ${credentials.token}`,
      },
      uri: url.resolve(credentials.uri, SSO_SUB_URI.USER),
      method: 'GET',
      qs: {
        email,
      },
    };

    const res = await request(options);
    const jsonRes = JSON.parse(res);
    return jsonRes[0].id;
  } catch (err) {
    throw new Error(`Cannot find SSO user: ${err}`);
  }
};

export const getUserGroups = async (credentials, userId) => {
  checkCredentialValid(credentials);
  try {
    const options = {
      headers: {
        'Content-Type': SSO_REQUEST.CONTENT_TYPE_FORM,
        Authorization: `Bearer ${credentials.token}`,
      },
      uri: url.resolve(credentials.uri, `${SSO_SUB_URI.USER}/${userId}/${SSO_SUB_URI.GROUP}`),
      method: 'GET',
    };

    const res = await request(options);
    const jsonRes = JSON.parse(res);
    return jsonRes;
  } catch (err) {
    throw new Error(`Cannot find SSO user groups: ${err}`);
  }
};

export const getUserIdps = async (credentials, userId) => {
  checkCredentialValid(credentials);
  try {
    const options = {
      headers: {
        'Content-Type': SSO_REQUEST.CONTENT_TYPE_FORM,
        Authorization: `Bearer ${credentials.token}`,
      },
      uri: url.resolve(credentials.uri, `${SSO_SUB_URI.USER}/${userId}/${SSO_SUB_URI.IDP}`),
      method: 'GET',
    };

    const res = await request(options);
    const jsonRes = JSON.parse(res);
    return jsonRes;
  } catch (err) {
    throw new Error(`Cannot find SSO user IDP: ${err}`);
  }
};

export const getUserInfoByEmail = async (credentials, email) => {
  checkCredentialValid(credentials);

  try {
    const options = {
      headers: {
        'Content-Type': SSO_REQUEST.CONTENT_TYPE_FORM,
        Authorization: `Bearer ${credentials.token}`,
      },
      uri: url.resolve(credentials.uri, SSO_SUB_URI.USER),
      method: 'GET',
      qs: {
        email,
      },
    };

    const res = await request(options);
    const userInfoJson = JSON.parse(res);
    if (userInfoJson.length < 1) {
      throw new Error('No such SSO user');
    }
    const ssoUserInfo = userInfoJson[0];
    const groups = await getUserGroups(credentials, ssoUserInfo.id);
    const idps = await getUserIdps(credentials, ssoUserInfo.id);
    return {
      id: ssoUserInfo.id,
      email: ssoUserInfo.email ? ssoUserInfo.email : null,
      firstName: ssoUserInfo.firstName ? ssoUserInfo.firstName : null,
      lastName: ssoUserInfo.lastName ? ssoUserInfo.lastName : null,
      group: groups,
      idp: idps,
    };
  } catch (err) {
    throw new Error(`Fail to retrive SSO user infomation: ${err}`);
  }
};

export const getUserInfoById = async (credentials, id) => {
  checkCredentialValid(credentials);

  try {
    const options = {
      headers: {
        'Content-Type': SSO_REQUEST.CONTENT_TYPE_FORM,
        Authorization: `Bearer ${credentials.token}`,
      },
      uri: url.resolve(credentials.uri, `${SSO_SUB_URI.USER}/${id}`),
      method: 'GET',
    };

    const res = await request(options);
    const userInfoJson = JSON.parse(res);
    const ssoUserId = userInfoJson.id;
    const groups = await getUserGroups(credentials, ssoUserId);
    const idps = userInfoJson.federatedIdentities;
    return {
      id: userInfoJson.id,
      email: userInfoJson.email ? userInfoJson.email : null,
      firstName: userInfoJson.firstName ? userInfoJson.firstName : null,
      lastName: userInfoJson.lastName ? userInfoJson.lastName : null,
      group: groups,
      idp: idps,
    };
  } catch (err) {
    throw new Error(`Fail to retrive SSO user infomation: ${err}`);
  }
};

export const checkSSOGroup = async (credentials, userId, targetGroups = []) => {
  try {
    const groups = await getUserGroups(credentials, userId);
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
 * @return {Object} As { isPending, isAuthorized, isRejected }
 */
export const checkUserAuthStatus = async userInfo => {
  const accountStatus = { isPending: false, isAuthorized: false, isRejected: false };

  try {
    const ssoGroupNames = userInfo.group.map(i => i.name);
    const isPending = ssoGroupNames.includes('pending');
    const isAuthorized = ssoGroupNames.includes('registered');

    // if user has complete profile and matches requirement, return the current sso group status:
    if (isPending || isAuthorized) {
      // User need to have a valid profile before they become authorized.
      // If not, return status as not initiated:
      if (!checkUserProfile(userInfo)) return accountStatus;
      // If user has a valid profile, return the current status:
      return {
        ...accountStatus,
        ...{
          isPending,
          isAuthorized,
        },
      };
    }

    // else, it's a new user, check if account is not matching the requirments, then reject:
    const matchSchema = await checkRocketChatSchema(userInfo);
    if (!matchSchema) return { ...accountStatus, ...{ isRejected: true } };
    return accountStatus;
  } catch (err) {
    throw new Error(`Fail to check SSO user authorization info: ${err}`);
  }
};

export const checkEmailExists = async (credentials, userInfo) => {
  checkCredentialValid(credentials);

  try {
    const options = {
      headers: {
        'Content-Type': SSO_REQUEST.CONTENT_TYPE_FORM,
        Authorization: `Bearer ${credentials.token}`,
      },
      uri: url.resolve(credentials.uri, SSO_SUB_URI.USER),
      method: 'GET',
      qs: {
        email: userInfo.email,
      },
    };

    const res = await request(options);
    const jsonRes = JSON.parse(res);
    console.log('---------------------jsonRes');
    console.log(jsonRes);
    if (jsonRes.length > 0) {
      const ids = jsonRes.map(user => user.id);
      return ids.some(id => id !== userInfo.id);
    }
    return true;
  } catch (err) {
    throw new Error(`Cannot filter SSO user with email, err - ${err}`);
  }
};

export const updateUser = async (credentials, userInfo) => {
  checkCredentialValid(credentials);
  try {
    const options = {
      headers: {
        'Content-Type': SSO_REQUEST.CONTENT_TYPE_JSON,
        Authorization: `Bearer ${credentials.token}`,
      },
      uri: url.resolve(credentials.uri, `${SSO_SUB_URI.USER}/${userInfo.id}`),
      method: 'PUT',
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

export const getGroupID = async (credentials, groupName) => {
  checkCredentialValid(credentials);

  try {
    const options = {
      headers: {
        'Content-Type': SSO_REQUEST.CONTENT_TYPE_FORM,
        Authorization: `Bearer ${credentials.token}`,
      },
      uri: url.resolve(credentials.uri, SSO_SUB_URI.GROUP),
      method: 'GET',
      qs: {
        search: groupName,
      },
    };

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

export const addUserToGroup = async (credentials, userId, groupName) => {
  checkCredentialValid(credentials);

  try {
    // TBD: use group name or ID?
    const groupId = await getGroupID(credentials, groupName);
    const subUrl = `${SSO_SUB_URI.USER}/${userId}/${SSO_SUB_URI.GROUP}/${groupId}`;
    const options = {
      headers: {
        'Content-Type': SSO_REQUEST.CONTENT_TYPE_FORM,
        Authorization: `Bearer ${credentials.token}`,
      },
      uri: url.resolve(credentials.uri, subUrl),
      method: 'PUT',
    };

    const res = await request(options);
    return res;
  } catch (err) {
    throw new Error(`Cannot add SSO user to group: ${err}`);
  }
};

export const removeUserFromGroup = async (credentials, userId, groupName) => {
  checkCredentialValid(credentials);

  try {
    // TBD: use group name or ID?
    const groupId = await getGroupID(credentials, groupName);
    const subUrl = `${SSO_SUB_URI.USER}/${userId}/${SSO_SUB_URI.GROUP}/${groupId}`;
    const options = {
      headers: {
        'Content-Type': SSO_REQUEST.CONTENT_TYPE_FORM,
        Authorization: `Bearer ${credentials.token}`,
      },
      uri: url.resolve(credentials.uri, subUrl),
      method: 'DELETE',
    };

    const res = await request(options);
    return res;
  } catch (err) {
    throw new Error(`Cannot remove SSO user from group: ${err}`);
  }
};
