import Vue from 'vue'
import {
  sliceStr,
  splitAddress,
  reldbIcon,
  transferCoords,
  weiToEth,
  dateFormat,
  timeFormat
} from 'utils/tool'

Vue.filter('splitAddress', splitAddress)

Vue.filter('dateFormat', dateFormat)

Vue.filter('timeFormat', timeFormat)

Vue.filter('sliceStr', sliceStr)

Vue.filter('weiToEth', weiToEth)

Vue.filter('transferCoords', transferCoords)

Vue.filter('reldbIcon', reldbIcon)
