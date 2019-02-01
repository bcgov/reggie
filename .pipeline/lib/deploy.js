'use strict';
const {Pipeline, OpenShiftClient, OpenShiftClientX} = require('pipeline-cli')
const path = require('path');


module.exports = (settings)=>{
  const oc=new OpenShiftClientX();
  oc.globalArgs.namespace = `devhub-${oc.options.env}`
  var templateFile = path.resolve(__dirname, '../../openshift/dc.yaml')
  const appName = 'reggie-api'
  const buildNamespace = 'devhub-tools'
  const buildVersion = '1.0.0'
  const deploymentVersion = `${oc.options.env}-1.0.0`
  // remove pr in prefix for test and prod environemnt:
  const projectPrefix = (oc.options.env === "test") || (oc.options.env === "prod") ? `-${oc.options.env}` : `-${oc.options.env}-${oc.options.pr}`,

  var objects = oc.process(oc.toFileUrl(templateFile), {
    'param':{
      'NAME':appName,
      'SUFFIX':projectPrefix,
      'VERSION':`${deploymentVersion}`
    }
  })

  oc.applyBestPractices(objects)
  oc.applyRecommendedLabels(objects, appName, oc.options.env, oc.options.pr)
  oc.fetchSecretsAndConfigMaps(objects)
  oc.importImageStreams(objects, deploymentVersion, buildNamespace, buildVersion)
  oc.applyAndDeploy(objects, `${appName}${projectPrefix}`)

}