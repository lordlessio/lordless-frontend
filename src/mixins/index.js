// // import login from './login'
const contractMixins = require('./contract')
const dialogMixins = require('./dialog')
const metamaskMixins = require('./metamask')
const checkMobile = require('./checkMobile')
const userMixins = require('./user')
const layoutMixins = require('./layout')
const publicMixins = require('./public')
const activatedMixins = require('./activated')

// console.log('contractMixins', contractMixins)
// // export const loginMixins = login
module.exports = {
  contractMixins: contractMixins.default,
  dialogMixins: dialogMixins.default,
  metamaskMixins: metamaskMixins.default,
  checkMobileMixins: checkMobile.default,
  userMixins: userMixins.default,
  layoutMixins: layoutMixins.default,
  publicMixins: publicMixins.default,
  activatedMixins: activatedMixins.default
}
