'use strict';
const task = require('./lib/clean.js');
const settings = require('./lib/config.js');

task(Object.assign(settings, { phase: settings.options.env }));
