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
import { Redirect } from 'react-router-dom';
import qs from 'query-string';

// Here checks for the parameters that come with the email link:
export class Email extends Component {
  static displayName = '[Component Email JWT]';
  componentWillMount = () => {
    try {
      const parsed = qs.parse(this.props.location.search);
      localStorage.setItem('emailJwt', parsed.jwt);
      localStorage.setItem('emailIntention', parsed.emailIntention);
    } catch (err) {
      console.log('---email verification JWT not found---');
    }
  };

  render() {
    return <Redirect to="/" />;
  }
}
