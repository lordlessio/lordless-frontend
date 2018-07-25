import Vue from 'vue'
import { splitAddress, dateFormat } from 'utils/tool'

Vue.filter('splitAddress', splitAddress)

Vue.filter('dateFormat', dateFormat)

Vue.filter('sliceStr', (str, { start = 0, end = 10 } = {}) => {
  if (!str) return str
  return str.toString().slice(start, end)
})
