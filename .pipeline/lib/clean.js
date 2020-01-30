'use strict';
const { OpenShiftClientX } = require('@bcgov/pipeline-cli');

module.exports = settings => {
  const phases = settings.phases;
  const options = settings.options;
  const oc = new OpenShiftClientX(Object.assign({ namespace: phases.build.namespace }, options));

  const build_phase = phases.build.phase;
  const deploy_phase = options.env;

  for (var k in phases) {
    if (phases.hasOwnProperty(k)) {
      const phase = phases[k];

      // Clean up istag in tools:
      if (k == build_phase) {
        console.log(`In namespace ${phase.namespace}`);

        const buildConfigs = oc.get('bc', {
          selector: `app=${phase.instance},env-id=${phase.changeId},!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`,
          namespace: phase.namespace,
        });

        buildConfigs.forEach(bc => {
          if (bc.spec.output.to.kind == 'ImageStreamTag') {
            oc.delete([`ImageStreamTag/${bc.spec.output.to.name}`], {
              'ignore-not-found': 'true',
              wait: 'true',
              namespace: phase.namespace,
            });
          }
        });
      }

      // Note: as to match the RC dev instance, there's only one dev Reggie as well. No need for the following step:

      // Clean up everything in the temporary deployed env:
      // if (k == deploy_phase) {
      //   console.log(`In namespace ${phase.namespace}`);

      //   oc.raw('delete', ['all,pvc,Secret,configmap,endpoints,RoleBinding,role,ServiceAccount,Endpoints'], {
      //     selector: `app=${phase.instance},env-id=${phase.changeId},!shared`,
      //     'ignore-not-found': 'true',
      //     wait: 'true',
      //     namespace: phase.namespace,
      //   });
      // }
    }
  }
};
