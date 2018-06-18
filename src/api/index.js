const { mergeObject } = require('utils/tool')
let axios = require('./service/axios')
const aMap = require('./aMap')
const candy = require('./candy')
const ldb = require('./ldb')
const ldbIcon = require('./ldbIcon')
const taskType = require('./taskType')
const user = require('./user')
axios = axios.default
module.exports = mergeObject([
  aMap(axios),
  candy(axios),
  ldb(axios),
  ldbIcon(axios),
  taskType(axios),
  user(axios)
])
