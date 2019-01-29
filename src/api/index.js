const merge = require('lodash/merge')
const axios = require('./service/axios').default
const aMap = require('./aMap')
const mapbox = require('./mapbox')
const google = require('./google')
const candy = require('./candy')
const ethereum = require('./ethereum')
const ldb = require('./ldb')
const ldbIcon = require('./ldbIcon')
const task = require('./task')
const taskType = require('./taskType')
const user = require('./user')
const userAsset = require('./userAsset')
const userRecord = require('./userRecord')
const activity = require('./activity')
const home = require('./home')
const region = require('./region')
const airdrop = require('./airdrop')
const plan = require('./plan')
const bounty = require('./bounty')

module.exports = merge(
  aMap(axios),
  candy(axios),
  ethereum(axios),
  ldb(axios),
  ldbIcon(axios),
  mapbox(axios),
  google(axios),
  task(axios),
  taskType(axios),
  user(axios),
  userAsset(axios),
  userRecord(axios),
  activity(axios),
  home(axios),
  region(axios),
  airdrop(axios),
  plan(axios),
  bounty(axios)
)
