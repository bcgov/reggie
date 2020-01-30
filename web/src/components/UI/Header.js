//
// Reggie Web
//
// Copyright © 2018 Province of British Columbia
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
// Created by Jason Leach on 2018-09-04.
//

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthButton from '../Auth/AuthButton';
import { APP_INFO } from '../../constants';
import Banner from './Banner';
import './Header.css';

export const Header = ({ authentication }) => {
  return (
    <header className="header">
      <Banner link="/" titleText={APP_INFO.NAME} />
      <AuthButton isAuthenticated={authentication.isAuthenticated} />
    </header>
  );
};

Header.propTypes = {
  authentication: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    authentication: state.authentication,
  };
};

export default connect(
  mapStateToProps,
  null
)(Header);
