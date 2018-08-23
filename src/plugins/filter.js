import Vue from 'vue'
import {
  formatDue,
  formatDecimal,
  sliceStr,
  splitAddress,
  reldbIcon,
  transferCoords,
  weiToEth,
  dateFormat,
  timeFormat,
  formatLdbType,
  nextAC,
  remainingAC
} from 'utils/tool'

Vue.filter('splitAddress', splitAddress)

Vue.filter('dateFormat', dateFormat)

Vue.filter('timeFormat', timeFormat)

Vue.filter('formatDecimal', formatDecimal)

Vue.filter('sliceStr', sliceStr)

Vue.filter('weiToEth', weiToEth)

Vue.filter('transferCoords', transferCoords)

Vue.filter('reldbIcon', reldbIcon)

Vue.filter('formatDue', formatDue)

Vue.filter('nextAC', nextAC)

Vue.filter('remainingAC', remainingAC)

Vue.filter('formatLdbType', formatLdbType)

// ldb detail 私有 filter

// 过滤 group 任务
Vue.filter('ldbGroupTasks', (list = []) => list.filter(item => item.ldbTaskType.taskType === 2))

// 过滤 group 任务candy
Vue.filter('ldbGroupCandies', (list = []) => {
  const groupTasks = list.filter(item => item.ldbTaskType.taskType === 2)
  const candies = groupTasks.map(item => item.ldbTaskType.candyType.symbol)
  return Array.from(new Set(candies))
})
