const merge = require('lodash/merge')
let axios = require('./service/axios')
const aMap = require('./aMap')
const mapbox = require('./mapbox')
const candy = require('./candy')
const ldb = require('./ldb')
const ldbIcon = require('./ldbIcon')
const taskType = require('./taskType')
const user = require('./user')
axios = axios.default
module.exports = merge(
  aMap(axios),
  candy(axios),
  ldb(axios),
  ldbIcon(axios),
  mapbox(axios),
  taskType(axios),
  user(axios)
)
