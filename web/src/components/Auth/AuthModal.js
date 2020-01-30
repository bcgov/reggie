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
// Created by Jason Leach on 2018-10-03.
//

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Banner from '../UI/Banner';
import { SSO_IDP, APP_INFO } from '../../constants';
import './AuthModal.css';

export const AuthModal = ({ isAuthenticated }) => {
  return (
    <Modal modalClassName="auth-modal" isOpen={!isAuthenticated} fade={false}>
      <ModalHeader>
        <Banner titleText={APP_INFO.NAME} />
      </ModalHeader>
      <ModalBody>Please login before starting Rocket.Chat Invitation with Reggie</ModalBody>
      <ModalFooter>
        <p>Login with:</p>
        <div className="auth-buttons">
          <Link className="auth-button" to={{ pathname: '/login', state: { idp: SSO_IDP.GITHUB } }}>
            GitHub
          </Link>
          <Link className="auth-button" to={{ pathname: '/login', state: { idp: SSO_IDP.IDIR } }}>
            IDIR
          </Link>
        </div>
      </ModalFooter>
    </Modal>
  );
};

AuthModal.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default AuthModal;
