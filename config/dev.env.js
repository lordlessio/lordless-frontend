'use strict'
const argv = require('yargs').argv
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
// const contract = JSON.stringify(merge(require('../.contract/development.json'), require('../.contract/airdrop/development.json')))
const contract = JSON.stringify(merge(require('../.contract/ropsten.json'), require('../.contract/airdrop/ropsten.json'), require('../.contract/luckyblock/ropsten.json')))
// const contract = JSON.stringify(merge(require('../.contract/mainnet.json'), require('../.contract/airdrop/mainnet.json'), require('../.contract/luckyblock/mainnet.json')))
const port = argv.port || 8080
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  port,
  BACKEND_SERVER: '"//10.229.4.202:8080/lordless"',
  // BACKEND_SERVER: `"//ropsten.lordless.games"`,
  // BACKEND_SERVER: `"//game.lordless.io"`,
  ETHERSCANURL: '"https://ropsten.etherscan.io"',
  APPROVED_NETWORK_ID: 5777,
  contract,
  tgBot: '"lordlesslocalbot"'
})
