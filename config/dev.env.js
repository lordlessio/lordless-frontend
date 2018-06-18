'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const fs = require('fs')
const envPath = require('path').join(require('os').homedir(), '.lordless/dev.conf')
const config = fs.readFileSync(envPath).toString()
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BACKEND_SERVER: '"//localhost:8080/lordless"',
  APPROVED_NETWORK_ID: 5777,
  contract: config,
})
