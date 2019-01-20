//
// Reggie
//
// Copyright © 2019 Province of British Columbia
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

'use strict';

import nodemailer from 'nodemailer';
import ejs from 'ejs';
import { EMAIL_REQUEST } from '../constants';

export const setMailer = async (host, port) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: false, // true for 465, false for other ports
      ignoreTLS: true,
      connectionTimeout: EMAIL_REQUEST.TIMEOUT,
    });

    transporter.verify();
    return transporter;
  } catch (err) {
    throw new Error(`Cannot setup mailer: ${err}`);
  }
};

export const generateLinkWithToken = async emailContent => {
  // TODO: depends on connection between web and api:
  return 'https://www.google.ca';
};

/**
 * Sending email with nodemailer
 *
 * @param {Object} emailServerConfig The configuration of email server, including host+port, and a sender email
 * @param {Object} userInfo The user information, including email, first and last name
 * @returns The email message id if sent successfully
 */
export const sendEmail = async (emailServerConfig, userInfo) => {
  try {
    // TODO: modify email contents and public host image/logo, and styling
    const confirmLink = generateLinkWithToken(userInfo);
    const logoLink = 'http://localhost:8000/gov-logo.png';
    const htmlPayload = await ejs.renderFile('public/emailConfirmation.ejs', {
      name: userInfo.firstName,
      confirmLink,
      logoLink,
    });

    const textPayload = await ejs.renderFile('public/emailConfirmation.txt', {
      name: userInfo.firstName,
      confirmLink,
    });

    const transporter = await setMailer(emailServerConfig.host, emailServerConfig.port);

    const mailOptions = {
      from: emailServerConfig.sender,
      to: userInfo.email, // list of receivers
      subject: EMAIL_REQUEST.CONFIRM_TITLE,
      text: textPayload,
      html: htmlPayload,
    };

    const emailRes = await transporter.sendMail(mailOptions);

    return emailRes.messageId;
  } catch (err) {
    throw new Error(`Unable to send email: ${err}`);
  }
};
