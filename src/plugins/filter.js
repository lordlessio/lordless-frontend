import Vue from 'vue'
import {
  format as dateFormat,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInCalendarDays,
  differenceInCalendarISOWeeks,
  differenceInCalendarMonths,
  differenceInCalendarISOYears
} from 'date-fns'
import { splitAddress } from 'utils/tool'

let web3js = { default: true }

Vue.filter('splitAddress', splitAddress)

Vue.filter('dateFormat', (date, format = 'MMMM Do YYYY, HH:mm:ss') => {
  return dateFormat(date, format)
})

Vue.filter('timeFormat', date => {
  const now = new Date()
  if (differenceInCalendarISOYears(now, new Date(date))) return `${differenceInCalendarISOYears(now, new Date(date))} years ago`
  else if (differenceInCalendarMonths(now, new Date(date))) return `${differenceInCalendarMonths(now, new Date(date))} months ago`
  else if (differenceInCalendarISOWeeks(now, new Date(date))) return `${differenceInCalendarISOWeeks(now, new Date(date))} weeks ago`
  else if (differenceInCalendarDays(now, new Date(date))) return `${differenceInCalendarDays(now, new Date(date))} days ago`
  else if (differenceInHours(now, new Date(date))) return `${differenceInHours(now, new Date(date))} hours ago`
  else if (differenceInMinutes(now, new Date(date))) return `${differenceInMinutes(now, new Date(date))} minutes ago`
  else return `${differenceInSeconds(now, new Date(date))} seconds ago`
})

Vue.filter('sliceStr', (str, { start = 0, end = 10 } = {}) => {
  if (!str) return str
  return str.toString().slice(start, end)
})

Vue.filter('weiToEth', (value) => {
  if (web3js.default) {
    const store = require('@/store').default
    web3js = store.state.web3.web3Opt.web3js
  }
  if (!value) return value

  value = parseInt(value)
  if (web3js.default) {
    value = value / 1e18
  } else {
    value = web3js.fromWei(value)
  }
  return parseFloat(parseInt(value).toFixed(4))
})

Vue.filter('transferCoords', (value) => {
  if (!value) return value
  value = parseFloat(value)
  return value / 1e16
})
