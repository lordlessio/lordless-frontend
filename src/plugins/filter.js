import Vue from 'vue'
import moment from 'moment'
import { splitAddress } from 'utils/tool'
window.moment = moment

Vue.filter('splitAddress', splitAddress)

Vue.filter('dateFormat', (date, format = 'MMMM Do YYYY, HH:mm:ss') => {
  return moment(date).format(format)
})

Vue.filter('timeFormat', date => {
  return moment(date).startOf('minute').fromNow()
})

Vue.filter('sliceStr', (str, { start = 0, end = 10 } = {}) => {
  if (!str) return str
  return str.toString().slice(start, end)
})
