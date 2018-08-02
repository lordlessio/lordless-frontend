// // import login from './login'
const contractMixins = require('./contract')
const dialogMixins = require('./dialog')

// console.log('contractMixins', contractMixins)
// // export const loginMixins = login
module.exports = {
  contractMixins: contractMixins.default,
  dialogMixins: dialogMixins.default
}
