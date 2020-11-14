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

// Here shows the infomation/next step if user is rejected to enter the app:
import React, { Component } from 'react';
import { SELF_SERVER_APP } from '../constants';
import './Rejection.css';

export class Rejection extends Component {
  static displayName = '[Component Rejection]';

  render() {
    return (
      <div>
        <h1>Failed to join to Rocket.Chat</h1>
        <p className="rejection-hints">
          Thank you for completing the account registration process.
        </p>
        <p className="rejection-instructions">
          We are unable to automatically add you to the Rocket.Chat service. Please request an
          invitation from your <b>product owner or team lead</b>.
          <br />
          <br />
          For more help, please refer to <a href={SELF_SERVER_APP.REGGIE.README}>steps to join Rocket.Chat</a>.
        </p>
      </div>
    );
  }
}
