'use strict';
const {Pipeline, OpenShiftClient, OpenShiftClientX} = require('pipeline-cli')
const path = require('path');


module.exports = (settings)=>{
  const oc=new OpenShiftClientX({'namespace':'devhub-dev'});
  var templateFile = path.resolve(__dirname, '../../openshift/_python36.dc.json')

  const buildNamespace = 'csnr-devops-lab-tools'
  const buildVersion = '1.0.0'
  const deploymentVersion = 'dev-1.0.0'

  var objects = oc.process(oc.toFileUrl(templateFile), {
    'param':{
      'NAME':'hello',
      'SUFFIX':'-prod',
      'VERSION':`${deploymentVersion}`
    }
  })

  oc.applyBestPractices(objects)
  oc.applyRecommendedLabels(objects, 'hello', 'dev', '1')
  oc.fetchSecretsAndConfigMaps(objects)
  oc.importImageStreams(objects, deploymentVersion, buildNamespace, buildVersion)
  oc.applyAndDeploy(objects, 'hello-dev-1')

}