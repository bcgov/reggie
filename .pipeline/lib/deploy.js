'use strict';

const { OpenShiftClientX } = require('@bcgov/pipeline-cli');
const path = require('path');

module.exports = (settings)=>{
  const phases = settings.phases;
  const options = settings.options;
  const phase = options.env;
  const changeId = phases[phase].changeId;
  const oc = new OpenShiftClientX(Object.assign({ namespace: phases[phase].namespace }, options));
  const templatesLocalBaseUrl = oc.toFileUrl(path.resolve(__dirname, '../../openshift'));
  let objects = [];

  // set the rest of the env vars:
  const extraParams = {
    API_URL_VALUE: `${phases[phase].name}${phases[phase].suffix}.pathfinder.gov.bc.ca`,
  };

  // The deployment of your cool app goes here ▼▼▼
  objects = oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/dc.yaml`, {
    param: {
      ...{
        NAME: phases[phase].name,
        SUFFIX: phases[phase].suffix,
        VERSION: phases[phase].tag,
      },
      ...extraParams,
    },
  });
  // if you want to add more objects from other templates than contact them to objects
  // objects should be a flat array
  oc.applyRecommendedLabels(
    objects,
    phases[phase].name,
    phase,
    `${changeId}`,
    phases[phase].instance,
  );
  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, phases.build.tag);

  // oc.fetchSecretsAndConfigMaps(objects);
  oc.applyAndDeploy(objects, phases[phase].instance);
};
