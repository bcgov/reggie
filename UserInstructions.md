---
title: Steps to join Rocket.Chat
description: Instruction on registering and joining Rocket.Chat
---

## Steps to join BCGov Rocket.Chat

### Prerequisites:

BCGov Rocket.Chat Users must:

1. Have an IDIR account, *or*
2. Have a GitHub account, which belongs to one of the BC Gov organizations: `bcgov`, `bcgov-c`, or `BCDevOps` *or*
3. receive an invite from an existing Rocket.Chat user. (see below for details on sending and accepting invitations)

**NOTE**: if you are using your IDIR account, your account MUST have an associated email address.
If it does not, there is no guarantee that your account will work, and we cannot guarantee that it will continue to work, even if you can log in the first time.

If you have problems logging into RocketChat, please check that you have an associated email address *first*, before contacting the Platform Services team for help.
We cannot fix issues that arise from your IDIR account having no associated email address. Contact 7-7000 for help with that issue.

---
### 1. How to register for Rocket.Chat:

If you have an account that satisfies prerequisite 1. or 2. above, you can follow the steps below to register and access Rocket.Chat.  

- Go to [Rocket.Chat login page](https://chat.pathfinder.gov.bc.ca/), click on `Login` button
- You will be redirected to the KeyCloak login page with 2 different options to login: `GitHub` or `IDIR`
- Pick one of the login options based on the prerequisites above and complete the login process 
- When prompted, please verify and update the contact attributes shown below. **Note: even if these values are pre-populated,  please check and update them if they are not accurate.**
  - `Email`
  - `First name`
  - `Last name`
- A verification email will be sent to the email address you've provided. Please follow the steps in the email to complete the registration process.
- You will be directed back to Rocket.Chat once the email verification is complete. *Note:* email verification is only required once.

### 2. How to invite new users:

Users who *do not* have an account that satisfies prerequisite 1. or 2., above, will need to be invited by user who has completed the registration process.  The steps below are for users who have complete the registration process themselves and want to invite other users who cannot because their existing accounts don't meet the prerequisites.  

1. Visit [Reggie](https://reggie.developer.gov.bc.ca/) (a.k.a Rocket.Chat Invitation App). If not already logged in, log in to Reggie. *Note:* you must login to Reggie with the same account as you used to register with Rocket.Chat.
1. Once logged into Reggie, click on the `Invite New User` button and enter the email address of the person you wish to invite to Rocket.Chat.  **Please double check that you have provided the correct email address, as Reggie verifies new user based on this email.**
1. If the invitation is successfully sent, a green message will be displayed pop up. If not, please contact BC Gov DevHub team for help - something unexpected has happened!

### 3. Receiving and accepting an invitation

If you've received an invitation from an existing Rocket.Chat user, you can accept the invite and complete your own registration following the steps below.  

- When you receive an email inviting you to join Rocket.Chat, please click on the link.
- You will be asked to login first, via either `GitHub` or `IDIR`.
  - Please make sure to login to the account that has the same email address associated with it that your invitation was sent to, otherwise validation will fail.
- Continue and complete your business contact information.
- Once logged into Reggie, the app will validate your invitation.
  - If the invitation is valid, you will see a button to continue to Rocket.Chat.
  - If not, please ask the person who invited you for another invite, and double check the email address you receive the invitation with is the same as the one associated with the account you log in with.

## Rocket.Chat Desktop App Troubleshooting

People have had trouble logging in with the latest versions (2.15+) of the desktop app.

Instead of downloading the latest version, go [here](https://github.com/RocketChat/Rocket.Chat.Electron/releases/tag/2.14.7) and download **rocketchat-2.14.7.dmg**. 

If you still have trouble logging in, wait until the countdown timer reaches ~40s and click the 'Retry' button.

Please report any other problems by [opening an Issue](https://github.com/RocketChat/Rocket.Chat.Electron/issues/new).
