'use strict'
const argv = require('yargs').argv
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
// const contract = JSON.stringify(require('../.contract/development.json'))
const contract = JSON.stringify(require('../.contract/mainnet.json'))
const port = argv.port || 8080
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  port,
  LDBICON_ORIGIN: '"//lordless.oss-cn-hongkong.aliyuncs.com"',
  BACKEND_SERVER: '"//10.229.0.123:8080/lordless"',
  // BACKEND_SERVER: `"//ropsten.lordless.games"`,
  ETHERSCANURL: '"https://ropsten.etherscan.io/"',
  APPROVED_NETWORK_ID: 5777,
  contract,
  tgBot: '"lordlesslocalbot"'
})
