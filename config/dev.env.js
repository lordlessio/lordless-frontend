'use strict'
const argv = require('yargs').argv
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const contract = JSON.stringify(require('../.contract/development.json'))
// const contract = JSON.stringify(require('../.contract/ropsten.json'))
const port = argv.port || 8080
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  port,
  LDBICON_ORIGIN: '"http://lordless.oss-cn-hongkong.aliyuncs.com"',
  BACKEND_SERVER: `"//localhost:${port}/lordless"`,
  ETHERSCANURL: '"https://ropsten.etherscan.io/"',
  APPROVED_NETWORK_ID: 5777,
  contract,
  tgBot: '"lordlesslocalbot"'
})
