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
import { SSO_SUB_URI, SSO_REQUEST, TARGET_GITHUB_ORGS, SSO_IDPS } from '../constants';
import { isUserInOrgs } from './gh-utils';

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
      email: ssoUserInfo.email,
      firstName: ssoUserInfo.firstName,
      lastName: ssoUserInfo.lastName,
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
    // TODO: why undefined not showing up?????   curl -i http://localhost:8000/api/v1/sso/user/31a6aa38-c1fa-4bae-8adf-298b27c73090
    return {
      id: userInfoJson.id,
      email: userInfoJson.email,
      firstName: userInfoJson.firstName,
      lastName: userInfoJson.lastName,
      group: groups,
      idp: idps,
    };
  } catch (err) {
    throw new Error(`Fail to retrive SSO user infomation: ${err}`);
  }
};

export const checkUserAuthorization = async userInfo => {
  // User need to have a valid profile before they become authorized
  const isUserValid = checkUserProfile(userInfo);

  try {
    // check if user has valid profile:
    if (!isUserValid) return false;
    const ssoGroupNames = userInfo.group.map(i => i.name);
    console.log(ssoGroupNames);
    // then if user belongs to Pending group -> not authorized:
    if (ssoGroupNames.includes('pending')) return false;
    // then if user belongs to Registered group -> authorized:
    if (ssoGroupNames.includes('registered')) return true;
    // then if user has IDIR account -> authorized:
    if (userInfo.idp.some(idp => idp.identityProvider === SSO_IDPS.IDIR)) return true;
    // then if user Github account belonging to target gh orgs -> authorized:
    const githubIdp = userInfo.idp.filter(idp => idp.identityProvider === SSO_IDPS.GITHUB);
    if (githubIdp.length > 0) {
      const ghUsername = githubIdp[0].userName;
      return isUserInOrgs(ghUsername, TARGET_GITHUB_ORGS);
    }
    // TODO: add check on authorization by token
  } catch (err) {
    throw new Error(`Fail to check SSO user authorization info: ${err}`);
  }
  return false;
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
