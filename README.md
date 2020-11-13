---
description: Reggie introduction
topics:
   - reggie
   - rocketchat
ignore: true
---

## About

Reggie is an application to register for and invite user to BCGov Rocket.Chat. Please refer to [user instructions](UserInstructions.md) to join the chat community.

## Usage

### Local Development

1. make sure you have the `.env` file in both web and api folder, required contents can be found in `.env.sample`
2. in ./api:
```shell
npm i # install dependency
npm run dev # to host the reggie API server
```
3. in ./web:
```shell
npm i # install dependency
npm run start # to host the frontend
```
4. publish the host for KeyCloak to redirect
```shell
npx ngrok http 3000
```

## Deployment (OpenShift)

Project is using a Nodejs based pipeline [here](.pipeline/README.md)
OpenShift configuration/templates [here](openshift)

## Getting Help or Reporting an Issue

To report bugs/issues/feature requests, please file an [issue](https://github.com/bcgov/reggie/issues/).

## How to Contribute

If you would like to contribute, please see our [CONTRIBUTING](CONTRIBUTING.md) guidelines.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). 
By participating in this project you agree to abide by its terms.

## Issues/Suggestions
Make Suggestions/Issues [here!](https://github.com/bcgov/reggie/issues/new)
Issues are [markdown supported](https://guides.github.com/features/mastering-markdown/).

## License

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
