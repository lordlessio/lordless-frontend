// // import login from './login'
const contractMixins = require('./contract')
const dialogMixins = require('./dialog')
const metamaskMixins = require('./metamask')

// console.log('contractMixins', contractMixins)
// // export const loginMixins = login
module.exports = {
  contractMixins: contractMixins.default,
  dialogMixins: dialogMixins.default,
  metamaskMixins: metamaskMixins.default
}
