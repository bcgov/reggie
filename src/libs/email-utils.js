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
import { EMAIL_REQUEST } from '../constants';

export const setMailer = async (host, port) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: false, // true for 465, false for other ports
      ignoreTLS: true,
    });

    transporter.verify();

    return transporter;
  } catch (err) {
    throw new Error(`Cannot setup mailer: ${err}`);
  }
};

export const sendEmail = async (emailServerConfig, email) => {
  try {
    const transporter = await setMailer(emailServerConfig.host, emailServerConfig.port);

    const mailOptions = {
      from: emailServerConfig.sender,
      to: email, // list of receivers
      subject: EMAIL_REQUEST.CONFIRM_TITLE,
      text: EMAIL_REQUEST.CONFIRM_CONTENT,
    };

    const emailRes = await transporter.sendMail(mailOptions);

    return emailRes.messageId;
  } catch (err) {
    throw new Error(`Cannot connect to KeyCloak: ${err}`);
  }
};