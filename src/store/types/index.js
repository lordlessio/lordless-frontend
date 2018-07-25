
/**
 * all store types
 */
const merge = require('lodash/merge')

const userTypes = require('./user')
const layoutTypes = require('./layout')
const web3 = require('./web3')
const ldb = require('./ldb')
const contract = require('./contract')
const status = require('./status')

// 将所有类型的 types 合并返回
module.exports = merge(userTypes, layoutTypes, web3, ldb, contract, status)
