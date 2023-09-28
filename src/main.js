'use strict';
const fsp = require('fs').promises;
const path = require('path');
const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  '@db': path.resolve(__dirname, 'db', 'db.js'),
  '@util': path.resolve(__dirname, 'util'),
  '@http': path.resolve(__dirname, 'http', 'http.js'),
  '@error': path.resolve(__dirname, 'error')
})

moduleAlias()

const load = require('./load.js');
const server = require('@http')
const db = require('@db');
const util = require('@util')

const sandbox = { console, db: Object.freeze(db), common: {}, require, util };
const apiPath = path.resolve(__dirname, 'api');

const routing = {
};

(async () => {
  const files = await fsp.readdir(apiPath);
  for (const fileName of files) {
    if (!fileName.endsWith('.js')) continue;
    const filePath = path.join(apiPath, fileName);
    const serviceName = path.basename(fileName, '.js');
    routing[`api/${serviceName}`] = await load(filePath, sandbox);
  }

  // staticServer('./static', 8000);
  server(routing, process.env.APP_PORT);
})();
