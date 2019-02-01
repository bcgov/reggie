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
  const projectPrefix = oc.options.env === "dev" ? `-${oc.options.env}-${oc.options.pr}` : `-${oc.options.env}`

  // set the rest of the env vars:
  let extraParams = {
    RM_HOST_VALUE: 'https://repo-mountie-devhub-prod.pathfinder.gov.bc.ca/bot/github/membership',
    WEB_URL_VALUE: oc.options.env === "prod" ? 'https://reggie-web-devhub-prod.pathfinder.gov.bc.ca' : 'https://reggie-web-test-devhub-test.pathfinder.gov.bc.ca',
    API_URL_VALUE: oc.options.env === `https://${appName}-${projectPrefix}-devhub-${oc.options.env}.pathfinder.gov.bc.ca`,
  }

  var objects = oc.process(oc.toFileUrl(templateFile), {
    'param':{
      ...{
        'NAME':appName,
        'SUFFIX':projectPrefix,
        'VERSION':`${deploymentVersion}`
      },
      ...extraParams,
    }
  })

  oc.applyBestPractices(objects)
  oc.applyRecommendedLabels(objects, appName, oc.options.env, oc.options.pr)
  oc.fetchSecretsAndConfigMaps(objects)
  oc.importImageStreams(objects, deploymentVersion, buildNamespace, buildVersion)
  oc.applyAndDeploy(objects, `${appName}${projectPrefix}`)

}