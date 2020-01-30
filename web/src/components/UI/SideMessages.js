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

import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import './SideMessages.css';

const SideMessages = ({ centerContent, rightContent }) => {
  return (
    <Container>
      <Row>
        <Col xs="0" sm="3" />
        <Col sm="6">{centerContent}</Col>
        <Col xs="12" sm="3" className="side-message">
          {rightContent}
        </Col>
      </Row>
    </Container>
  );
};

SideMessages.propTypes = {
  leftContent: PropTypes.object,
  centerContent: PropTypes.object.isRequired,
  rightContent: PropTypes.object.isRequired,
};

SideMessages.defaultProps = {
  leftContent: null,
};

export default SideMessages;
