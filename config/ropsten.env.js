'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')
const contract = JSON.stringify(require('../.contract/ropsten.json'))

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  LDBICON_ORIGIN: '"http://lordless.oss-cn-hongkong.aliyuncs.com/"',
  OSSFOLDERPATH: 'ropsten_dist',
  BACKEND_SERVER: '"//test.lordless.com"',
  ETHERSCANURL: '"https://ropsten.etherscan.io/tx/"',
  APPROVED_NETWORK_ID: 3,
  contract,
})
