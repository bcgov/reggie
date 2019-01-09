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

export const checkCredentialValid = credentials => {
  if (!credentials.uri) {
    throw new Error('A URL must be provided');
  }
  if (!(credentials.token || (credentials.username && credentials.password))) {
    throw new Error('An auth info must be provided, such as username-password pair or token.');
  }
};

export const checkUserProfile = (userInfo, userGroups = [], userIdps = []) => {
  let valid = false;
  try {
    valid = !(!userInfo.email || !userInfo.firstName || !userInfo.lastName);
    const details = {
      id: userInfo.id,
      email: userInfo.email,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      group: userGroups,
      idp: userIdps,
    };
    return { ...details, validUser: valid };
  } catch (err) {
    return { id: userInfo.id, group: userGroups, idp: userIdps, validUser: valid };
  }
};

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
    const ssoUserId = userInfoJson[0].id;
    const groups = await getUserGroups(credentials, ssoUserId);
    const idps = await getUserIdps(credentials, ssoUserId);
    const userProfile = checkUserProfile(userInfoJson[0], groups, idps);
    return userProfile;
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
    const userProfile = checkUserProfile(userInfoJson, groups, idps);
    return userProfile;
  } catch (err) {
    throw new Error(`Fail to retrive SSO user infomation: ${err}`);
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
      uri: credentials.uri,
      method: 'GET',
      qs: {
        search: groupName,
      },
    };

    const res = await request(options);
    const groupInfoJson = JSON.parse(res);
    if (groupInfoJson.length < 1) {
      throw new Error('No such SSO user');
    }
    return groupInfoJson[0].id;
  } catch (err) {
    throw new Error(`Cannot find SSO group: ${err}`);
  }
};

export const addUser2Group = async (credentials, userId, groupId) => {
  checkCredentialValid(credentials);

  const subUrl = `${SSO_SUB_URI.USER}/${userId}/${SSO_SUB_URI.GROUP}/${groupId}`;
  try {
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
