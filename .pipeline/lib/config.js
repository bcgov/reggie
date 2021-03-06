'use strict';
const options = require('@bcgov/pipeline-cli').Util.parseArguments();
const changeId = options.pr || options.suffix; //aka pull-request
const version = '1.0.0';
const name = 'reggie';

const phases = {
  build: {
    namespace: 'devhub-tools',
    name: `${name}`,
    phase: 'build',
    changeId: changeId,
    suffix: `-build-${changeId}`,
    instance: `${name}-build-${changeId}`,
    version: `${version}-${changeId}`,
    tag: `build-${version}-${changeId}`,
  },
  // no changeId involved in dev environment: keep only one instance
  // to be able to use KeyCloak auth plugin and test connection internally
  dev: {
    namespace: 'devhub-dev',
    name: `${name}`,
    phase: 'dev',
    changeId: changeId,
    suffix: '-dev',
    instance: `${name}-dev`,
    version: `${version}`,
    tag: `dev-${version}`,
  },
  test: {
    namespace: 'devhub-test',
    name: `${name}`,
    phase: 'test',
    changeId: changeId,
    suffix: '-test',
    instance: `${name}-test`,
    version: `${version}`,
    tag: `test-${version}`,
  },
  prod: {
    namespace: 'devhub-prod',
    name: `${name}`,
    phase: 'prod',
    changeId: changeId,
    suffix: '',
    instance: `${name}`,
    version: `${version}`,
    tag: `prod-${version}`,
  },
};

// This callback forces the node process to exit as failure.
process.on('unhandledRejection', reason => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = { phases, options };
