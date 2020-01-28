//
// Reggie Web
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
// Created by Shelly Xue Han on 2019-01-10.
//

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';
import { authenticateFailed, authenticateSuccess } from '../actions';
import { authorize } from '../actionCreators';
import implicitAuthManager from '../auth';
import { AUTH_CODE, SELF_SERVER_APP } from '../constants';
import { Home, RocketChat, Rejection, Email, Verify } from '../containers';
import Layout from '../hoc/Layout';
import PrivateRoute from './Navigation/PrivateRoute';
import { LoginRoute } from './Navigation/LoginRoute';
import './App.css';
import AuthModal from './Auth/AuthModal';

export class App extends Component {
  componentDidMount = () => {
    implicitAuthManager.registerHooks({
      onAuthenticateSuccess: () => this.props.login(),
      onAuthenticateFail: () => this.props.logout(),
      // onAuthLocalStorageCleared: () => this.props.logout(),
    });
    // don't call function if on localhost
    if (!window.location.host.match(/localhost/)) {
      implicitAuthManager.handleOnPageLoad();
    }
    try {
      const iamId = implicitAuthManager.idToken.data.sub;
      // if user authenticated, try authorization:
      if (iamId) this.props.authorize(SELF_SERVER_APP.ROCKETCHAT.NAME, iamId);
    } catch (err) {
      console.log('---implicitAuthManager----not logged in');
    }
  };

  render() {
    // Get the current authorization status code for private route:
    const currAuthCode = this.props.authorization.authCode;
    return (
      <Layout>
        <AuthModal isAuthenticated={this.props.authentication.isAuthenticated} />
        <Switch>
          <PrivateRoute
            path="/rocketChat"
            authorization={this.props.authorization}
            component={RocketChat}
            shouldRender={currAuthCode === AUTH_CODE.AUTHORIZED}
            redirectTo="/"
          />
          <Route path="/rejection" component={Rejection} />
          <Route path="/email" component={Email} />
          <Route
            path="/verify"
            component={Verify}
            authentication={this.props.authentication}
            authorization={this.props.authorization}
            verifyEmail={this.props.verifyEmail}
          />
          <Route
            path="/ssoLogin/:loginIdp"
            component={({ match }) => {
              if (match.params.loginIdp) {
                implicitAuthManager.config.kcIDPHint = match.params.loginIdp;
              }
              window.location = implicitAuthManager.getSSOLoginURI();
            }}
          />
          <Route path="/login" component={LoginRoute} />
          <Route
            path="/logout"
            component={() => {
              this.props.logout();
              window.location = implicitAuthManager.getSSOLogoutURI();
            }}
          />
          <Route path="/" component={Home} authentication={this.props.authentication} />
        </Switch>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
    authorization: state.authorization,
    verifyEmail: state.verifyEmail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      login: () => dispatch(authenticateSuccess()),
      logout: () => dispatch(authenticateFailed()),
      authorize,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
