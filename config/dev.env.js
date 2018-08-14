'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const contract = JSON.stringify(require('../.contract/development.json'))
// const contract = JSON.stringify(require('../.contract/ropsten.json'))
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  LDBICON_ORIGIN: '"http://lordless.oss-cn-hongkong.aliyuncs.com/"',
  BACKEND_SERVER: '"//localhost:80/lordless"',
  ETHERSCANURL: '"https://ropsten.etherscan.io/tx/"',
  APPROVED_NETWORK_ID: 5777,
  contract,
})
