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
// Created by Jason Leach on 2018-01-10.
//

'use strict';

export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

export const SSO_SUB_URI = {
  SA_AUTH_TOKEN: 'auth/realms/master/protocol/openid-connect/token',
  REALM_ADMIN: 'auth/admin/realms',
  USER: 'users',
  GROUP: 'groups',
  IDP: 'federated-identity',
  ROLE: 'role-mappings',
  COMPOSITE_ROLE: 'composite',
  CLIENT: 'clients',
};

export const SSO_REQUEST = {
  CONTENT_TYPE_FORM: 'application/x-www-form-urlencoded',
  CONTENT_TYPE_JSON: 'application/json',
  GRANT_TYPE: 'client_credentials',
  CLIENT_ID: 'admin-cli',
  SA_CREDENTIAL_NAME: 'ssoSA',
};

export const TARGET_GITHUB_ORGS = ['bcgov', 'bcgov-c', 'BCDevOps'];

export const SSO_IDPS = {
  IDP: 'identityProvider',
  IDIR: 'idir',
  GITHUB: 'github',
};

export const SSO_CLIENTS = {
  RC: 'rocketchat',
  REGGIE: 'reggie-api',
};

export const SSO_GROUPS = {
  INVITED: 'rocketchat-invited-users',
};

export const SSO_ROLES = {
  REGISTERED: 'rocketchat-users',
};

export const EMAIL_REQUEST = {
  EMAIL_CONFIG_NAME: 'emailServer',
  CONFIRM_TITLE: 'BC Gov Rocket.Chat Confirmation Email',
  INVITE_TITLE: 'BC Gov Rocket.Chat Invitation Email',
  JWT_EXPIRY: '1d',
  TIMEOUT: 40000,
};

export const EMAIL_CONTENT = {
  CONFIRMATION: 'confirm',
  INVITATION: 'invite',
  WEB_ROUTE: 'email',
};
