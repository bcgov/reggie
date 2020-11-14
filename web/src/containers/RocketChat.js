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
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { Element, scroller } from 'react-scroll';
import { SELF_SERVER_APP, SCROLLER, APP_INFO } from '../constants';
import { inviteUser } from '../actionCreators';
import { BaseForm } from '../components/UI/BaseForm';
import SideMessages from '../components/UI/SideMessages';
import './RocketChat.css';

// Only authorized user can access the app and invite new user:
class RocketChat extends Component {
  static displayName = '[Component RocketChat]';
  state = { toggled: false };

  render() {
    // Json Schema Form:
    const schema = {
      title: 'Invite User via Email',
      type: 'object',
      required: ['email'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          title: 'Email Address',
        },
      },
    };

    // TODO: disable button when in progress
    const onSubmit = ({ formData }) => {
      this.props.inviteUser(this.props.userInfo.id, formData.email, window.location.origin);
    };

    const onClick = () => {
      this.setState({ toggled: !this.state.toggled });
      scroller.scrollTo(SCROLLER.TARGET, SCROLLER.CONFIG);
    };

    const formStatus = {
      inProgress: this.props.invitationStarted,
    };

    const formMessages = {
      successMsg: this.props.sent ? 'Invitation Sent!' : null,
      failureMsg: this.props.errorMessages.length > 0 ? this.props.errorMessages[0] : null,
    };

    return (
      <div>
        <h1>Welcome to {APP_INFO.DISPLAY_NAME}</h1>
        <SideMessages
          centerContent={
            <div>
              <p>
                Hello {this.props.userInfo.firstName}
                <br />
                You are a member of Rocket.Chat. Please go ahead to the Rocket.Chat App!
              </p>
              {/* External link */}
              <a href={SELF_SERVER_APP.ROCKETCHAT.URL}>
                <Button className="btn btn-primary">Go to Rocket.Chat</Button>
              </a>
            </div>
          }
          rightContent={
            <div className="invite-message">
              <p>Team member having issue logging in?</p>
              <Button className="invite-button" outline color="secondary" onClick={onClick}>
                Invite New User
              </Button>
            </div>
          }
        />
        <Element name={SCROLLER.TARGET}>
          <BaseForm
            formSchema={schema}
            toggled={this.state.toggled}
            onSubmit={onSubmit}
            status={formStatus}
            messages={formMessages}
          />
        </Element>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.authorization.userInfo,
    invitationStarted: state.inviteUser.invitationStarted,
    sent: state.inviteUser.sent,
    errorMessages: state.inviteUser.errorMessages,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      inviteUser,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RocketChat);
