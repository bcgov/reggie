'use strict';
const {OpenShiftClient, OpenShiftClientX} = require('pipeline-cli')
const path = require('path');

module.exports = (settings)=>{
  const oc=new OpenShiftClientX({'namespace':'devhub-tools'});
  var templateFile = path.resolve(__dirname, '../../openshift/bc.yaml')
  
  const appName = 'reggie-api'

  var objects = oc.process(oc.toFileUrl(templateFile), {
    'param':{
      'NAME':appName,
      'SUFFIX':`-${oc.options.pr}`,
      'VERSION':'1.0.0',
      'SOURCE_REPOSITORY_URL':`${oc.git.uri}`,
      'SOURCE_REPOSITORY_REF':`${oc.git.branch_ref}`
    }
  })

  oc.applyBestPractices(objects)
  oc.applyRecommendedLabels(objects, appName, 'build', oc.options.pr)
  oc.fetchSecretsAndConfigMaps(objects)
  var applyResult = oc.apply(objects)
  applyResult.narrow('bc').startBuild()
}