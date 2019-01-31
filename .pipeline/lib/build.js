'use strict';
const {OpenShiftClient, OpenShiftClientX} = require('pipeline-cli')
const path = require('path');


module.exports = (settings)=>{
  const oc=new OpenShiftClientX({'namespace':'devhub-tools'});
  var templateFile = path.resolve(__dirname, '../../openshift/bc.yaml')

  var objects = oc.process(oc.toFileUrl(templateFile), {
    'param':{
      'NAME':'reggie-api',
      'SUFFIX':'-dev',
      'VERSION':'1.0.0',
      'SOURCE_REPOSITORY_URL':`${oc.git.uri}`,
      'SOURCE_REPOSITORY_REF':`${oc.git.branch_ref}`
    }
  })

  oc.applyBestPractices(objects)
  oc.applyRecommendedLabels(objects, 'reggie-api', 'dev', '1')
  oc.fetchSecretsAndConfigMaps(objects)
  var applyResult = oc.apply(objects)
  applyResult.narrow('bc').startBuild()
}