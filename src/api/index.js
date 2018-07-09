const merge = require('lodash/merge')
const axios = require('./service/axios').default
const aMap = require('./aMap')
const mapbox = require('./mapbox')
const google = require('./google')
const candy = require('./candy')
const ldb = require('./ldb')
const ldbIcon = require('./ldbIcon')
const taskType = require('./taskType')
const user = require('./user')
module.exports = merge(
  aMap(axios),
  candy(axios),
  ldb(axios),
  ldbIcon(axios),
  mapbox(axios),
  google(axios),
  taskType(axios),
  user(axios)
)
