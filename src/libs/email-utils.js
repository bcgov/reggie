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
import { htmlToText } from 'nodemailer-html-to-text';
import ejs from 'ejs';
import jwt from 'jsonwebtoken';
import { EMAIL_REQUEST, EMAIL_CONTENT } from '../constants';
import config from '../config';

export const setMailer = async (host, port) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = await nodemailer.createTransport({
      host,
      port,
      secure: false, // true for 465, false for other ports
      ignoreTLS: false,
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: EMAIL_REQUEST.TIMEOUT,
    });
    transporter.use('compile', htmlToText());

    await transporter.verify();
    return transporter;
  } catch (err) {
    throw new Error(`Cannot setup mailer: ${err}`);
  }
};

export const generateLinkWithToken = async (data, secret, intention, refUrl) => {
  const token = jwt.sign({ data }, secret, {
    expiresIn: EMAIL_REQUEST.JWT_EXPIRY,
  });
  return `${refUrl}/${EMAIL_CONTENT.WEB_ROUTE}?emailIntention=${intention}&jwt=${token}`;
};

export const verifyToken = async (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded.data) throw Error('JsonWebTokenError - no data found');
    return decoded.data;
  } catch (err) {
    throw Error(err);
  }
};

/**
 * Sending email with nodemailer
 *
 * @param {Object} emailServerConfig The configuration of email server, including host+port, and a sender email
 * @param {Object} userInfo The user information, including email, first and last name
 * @param {String} refUrl The reference url as the base url for link
 * @returns The email message id if sent successfully
 */
export const sendConfirmationEmail = async (emailServerConfig, userInfo, refUrl) => {
  try {
    // TODO: modify email contents and public host image/logo, and styling
    const confirmLink = await generateLinkWithToken(
      userInfo.email,
      process.env.EMAIL_CONFIRMATION_JWT_SECRET,
      EMAIL_CONTENT.CONFIRMATION,
      refUrl
    );
    const logoLink = `${config.get('apiUrl')}/gov-logo.png`;
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

/**
 * Sending email with nodemailer
 *
 * @param {Object} emailServerConfig The configuration of email server, including host+port, and a sender email
 * @param {String} email The email to send to
 * @param {String} code The security code
 * @param {String} refUrl The reference url as the base url for link
 * @returns The email message id if sent successfully
 */
export const sendInvitationEmail = async (emailServerConfig, email, code, refUrl) => {
  try {
    const encodeData = { email, code };
    const invitationLink = await generateLinkWithToken(
      encodeData,
      process.env.EMAIL_INVITATION_JWT_SECRET,
      EMAIL_CONTENT.INVITATION,
      refUrl
    );

    const logoLink = `${config.get('apiUrl')}/gov-logo.png`;
    const htmlPayload = await ejs.renderFile('public/emailInvitation.ejs', {
      invitationLink,
      logoLink,
    });

    const transporter = await setMailer(emailServerConfig.host, emailServerConfig.port);

    const mailOptions = {
      from: emailServerConfig.sender,
      to: email,
      subject: EMAIL_REQUEST.INVITE_TITLE,
      html: htmlPayload,
    };

    const emailRes = await transporter.sendMail(mailOptions);
    return emailRes.messageId;
  } catch (err) {
    throw new Error(`Unable to send email: ${err}`);
  }
};
