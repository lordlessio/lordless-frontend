'use strict'
const merge = require('webpack-merge')
const contract = JSON.stringify(merge(require('../.contract/mainnet.json'), require('../.contract/airdrop/mainnet.json'), require('../.contract/luckydrop/mainnet.json')))
const erc20ABI = JSON.stringify(require('../.abis/erc20.json'))

module.exports = {
  NODE_ENV: '"production"',
  LDBICON_ORIGIN: '"//lordless-sh.oss-cn-shanghai.aliyuncs.com"',
  OSSFOLDERPATH: 'dist',
  BACKEND_SERVER: '""',
  ETHERSCANURL: '"https://etherscan.io/"',
  APPROVED_NETWORK_ID: 1,
  contract,
  erc20ABI,
  tgBot: '"LORDLESS_bot"'
}
