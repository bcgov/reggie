//
// Reggie Web
//
// Copyright © 2019 Province of British Columbia
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

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { authorize } from '../actionCreators';
import { ROUTES, AUTH_CODE, APP_INFO, ERROR_MESSAGES } from '../constants';
import { Loader } from '../components/UI/Loader';

// Here provides option to access different services/apps
class Home extends Component {
  static displayName = '[Component Home]';

  render() {
    // get email intention and jwt from localStorage:
    const emailJwt = localStorage.getItem('emailJwt');
    const intention = localStorage.getItem('emailIntention');

    // Error message:
    const errMsg =
      this.props.errorMessages.length > 0 ? <p>{this.props.errorMessages[0]}</p> : null;

    // Set the rendering content based on authentication and authorization:
    const authenticationContent = this.props.isAuthenticated ? (
      errMsg
    ) : (
      <p>Please log in to proceed</p>
    );

    // Redirect for email invitation verification:
    const setEmailRedirect = (emailJwt, intention) => {
      if (!emailJwt || !intention) return null;
      if (intention === ROUTES.EMAIL.VERIFY) return <Redirect to="/verify" />;
      return null;
    };
    const emailRedirect = this.props.isAuthenticated ? setEmailRedirect(emailJwt, intention) : null;

    // Redirect based on authorization:
    const setAuthorizationRedirect = authCode => {
      switch (authCode) {
        case AUTH_CODE.AUTHORIZED:
          return <Redirect to="/rocketChat" />;
        case AUTH_CODE.PENDING:
          return <p>{ERROR_MESSAGES.INCOMPLETE_ACCOUNT}</p>;
        default:
          return <Redirect to="/rejection" />;
      }
    };

    const authorizeRedirect =
      this.props.isAuthenticated && this.props.userInfo.id
        ? setAuthorizationRedirect(this.props.authCode)
        : null;

    const loadingContent = this.props.isAuthorizing ? Loader : null;

    return (
      <div className="authed">
        <h1>Welcome to {APP_INFO.DISPLAY_NAME}</h1>
        {authenticationContent}
        {errMsg}
        {loadingContent}
        {emailRedirect}
        {authorizeRedirect}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authentication.isAuthenticated,
    authCode: state.authorization.authCode,
    isAuthorizing: state.authorization.isAuthorizing,
    userInfo: state.authorization.userInfo,
    errorMessages: state.authorization.errorMessages,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      authorize,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
