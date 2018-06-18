
/**
 * all store typeNames
 */
const { mergeObject } = require('utils/tool')

const userTypes = require('./user')
const layoutTypes = require('./layout')
const web3 = require('./web3')

// 将所有类型的 typeNames 合并返回
module.exports = mergeObject([userTypes, layoutTypes, web3])
