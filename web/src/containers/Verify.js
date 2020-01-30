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
import { authorize, verifyEmail } from '../actionCreators';
import { Loader } from '../components/UI/Loader';
import { ERROR_MESSAGES } from '../constants';

// Here check if invited user is valid:
class Verify extends Component {
  static displayName = '[Component Verify]';

  // Remove localstorage when done with the flow:
  componentWillUnmount = () => {
    localStorage.removeItem('emailJwt');
    localStorage.removeItem('emailIntention');
  };

  render() {
    let invitationRedirect = null;
    const ssoErrMsg = ERROR_MESSAGES.INCOMPLETE_ACCOUNT;

    // Error messages from either email verification or authorization:
    const errMsg =
      this.props.errorMessages.length > 0 ? (
        <p>{this.props.errorMessages[0]}</p>
      ) : this.props.authErrorMessages.length > 0 ? (
        <p>{this.props.authErrorMessages[0]}</p>
      ) : null;

    // Redirect if email invitation is verified:
    if (this.props.verfied) invitationRedirect = <Redirect to="/" />;

    // Get the previously stored jwt:
    const emailJwt = localStorage.getItem('emailJwt');

    // When not loading process or error message, start to verify email:
    if (
      this.props.userInfo.id !== null &&
      !this.props.verifyStarted &&
      this.props.userInfo.email !== null &&
      errMsg === null
    ) {
      this.props.verifyEmail(this.props.userId, this.props.userInfo.email, emailJwt);
    }

    const pageContent =
      this.props.userInfo.id === null || this.props.verifyStarted
        ? Loader
        : this.props.userInfo.email === null
        ? ssoErrMsg
        : null;

    return (
      <div>
        {invitationRedirect}
        <h1>Verify Invitation to Rocket.Chat</h1>
        {errMsg}
        {pageContent}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.authentication.userId,
    verifyStarted: state.verifyEmail.verifyStarted,
    verfied: state.verifyEmail.verfied,
    errorMessages: state.verifyEmail.errorMessages,
    userInfo: state.authorization.userInfo,
    authErrorMessages: state.authorization.errorMessages,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      authorize,
      verifyEmail,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Verify);
