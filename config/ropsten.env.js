'use strict'
const merge = require('webpack-merge')
// const devEnv = require('./dev.env')
const prodEnv = require('./prod.env')
const contract = JSON.stringify(merge(require('../.contract/ropsten.json'), require('../.contract/airdrop/ropsten.json')))

module.exports = merge(prodEnv, {
  NODE_ENV: '"ropsten"',
  OSSFOLDERPATH: 'ropsten_dist',
  BACKEND_SERVER: '"//ropsten.lordless.games"',
  ETHERSCANURL: '"https://ropsten.etherscan.io/"',
  APPROVED_NETWORK_ID: 3,
  contract,
  tgBot: '"lordlessropstenbot"'
})
