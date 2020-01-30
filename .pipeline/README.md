## Pipeline Wrapper Scripts

Our pipeline utilities are a set of __Node JS__ scripts which are abstracted away from specific CI/CD tools so that they can be more easily ported. The main utility behind these scripts are around a package called `@bcgov/pipeline-cli` which
has methods that wrap OpenShift `oc cli` functions and apply __bcgov best practices__. 

## How it works

It is fairly straight forward to get started. Running any of the npm scripts firstly goes through a routine
that parses command line arguments and returns them as an `Object` which can than be leveraged in any of the
script files. 

The script files are __frameworkless__. You leverage `@bcgov/pipeline-cli` and other utilities to form your
logic and run your continuous deployments/delivery.

## Prerequisites

- login to oc cli
- npm install
- fill environment variables

## Building and Deploying

Refer to [Jenkinsfile](../Jenkinsfile) for the commands in different stages.
