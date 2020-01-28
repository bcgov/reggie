/*
Copyright 2019 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at 

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Created by Patrick Simonian
*/
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
/**
 * component used to gate another component based on authentication
 * auto redirect if not authenticated
 * @param {Object} props authenticated coming from connected component
 * usage
 * <AuthenticatedOnly>
 *  <your component here />
 * </AuthenticatedOnly>
 */
export const AuthenticatedOnly = ({ authenticated, children }) =>
  authenticated ? children : <Redirect to="/" />;

const mapStateToProps = state => ({
  authenticated: state.isAuthenticated,
});

export default connect(
  mapStateToProps,
  null
)(AuthenticatedOnly);
