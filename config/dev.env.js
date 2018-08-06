'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const contract = JSON.stringify(require('../src/contract/file/development.json'))
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BACKEND_SERVER: '"//localhost:8080/lordless"',
  APPROVED_NETWORK_ID: 5777,
  contract,
})
