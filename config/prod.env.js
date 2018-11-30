'use strict'
const contract = JSON.stringify(require('../.contract/mainnet.json'))

module.exports = {
  NODE_ENV: '"production"',
  LDBICON_ORIGIN: '"//lordless-sh.oss-cn-shanghai.aliyuncs.com"',
  OSSFOLDERPATH: 'dist',
  BACKEND_SERVER: '""',
  ETHERSCANURL: '"https://etherscan.io/"',
  APPROVED_NETWORK_ID: 1,
  contract,
  tgBot: '"LORDLESS_bot"'
}
