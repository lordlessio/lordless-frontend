import {
  format as dateFnsFormat,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInCalendarDays,
  differenceInCalendarISOWeeks,
  differenceInCalendarMonths,
  differenceInCalendarISOYears
} from 'date-fns'
import store from '@/store'

window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         function (callback) {
           window.setTimeout(callback, 1000 / 60)
         }
})()

/**
 * 获取 data 数据类型
 * @param {Object} data 需要分析的数据
 *
 * 返回数组形式， String1: 数据详细类型，String2：数据大类型.一般为 'object'
 * @return {Array} [ String1, String2 ]
 * x
 */
export const objectType = (data) => {
  const type = typeof data
  if (type !== 'object') {
    return [type, type]
  }
  let objT = Object.prototype.toString.call(data)
  objT = (objT.split(' ')[1].replace(/]/, '')).toLocaleLowerCase()
  return [objT, type]
}

// 序列化 反序列化
export const stringifyParse = (data) => {
  if (objectType(data)[1] !== 'object') return data
  return JSON.parse(JSON.stringify(data))
}

/**
 * 截取显示部分地址
 */
export const splitAddress = (address, { before = 8, end = 6, symbol = '…' } = {}) => {
  if (typeof address !== 'string') return address
  return address.slice(0, before) + symbol + address.slice(-end)
}

/**
 * 合并多个对象，包括同属性名的子对象
 * 目前只支持一层
 * 扩展： deepmerge
 */
// mergeObject: (objects) => {
//   if (objectType(objects)[0] !== 'array') return objects

//   // 合并所有对象，将层级不同的添加进去
//   const obj = Object.assign({}, ...objects)

//   const keys = objects.map(item => {
//     return Object.keys(item)
//   })

//   // 获取所有对象的 key
//   const allKeys = keys.reduce((acc, cut) => acc.concat(cut))

//   // 获取重复的 key
//   const coincideKeys = duplicates(allKeys)

//   // 遍历重复的 key，将子对象合并
//   for (const key of coincideKeys) {
//   // 如果子元素是对象，合并所有 object 的该子元素
//     if (objectType(obj[key])[0] === 'object') obj[key] = Object.assign({}, ...objects.map(ob => ob[key]))

//     // 如果子元素是数组，合并并去重所有 object 的该子元素
//     else if (objectType(obj[key])[0] === 'array') obj[key] = Array.from(new Set(objects.map(ob => ob[key]).reduce((accob = [], curob = []) => accob.concat(curob))))
//   }
//   // keys.reduce((accumulator, ))
//   return obj
// },

// duplicates: (arr) => {
//   const result = []
//   arr.forEach(function (item) {
//     if (arr.indexOf(item) !== arr.lastIndexOf(item) && result.indexOf(item) === -1) { result.push(item) }
//   })
//   return result
// },

// get object localStorage data
export const getObjStorage = (key = 'lordless_tokens', type = 'object') => {
  const data = window.localStorage.getItem(key)
  if (!data) return type === 'object' ? {} : []
  try {
    return JSON.parse(data)
  } catch (err) {
    return type === 'object' ? {} : []
  }
}

export const historyState = (hash) => {
  window.history.pushState(null, null, hash)
}

export const hasClass = (name, dom) => {
  if (!dom || typeof dom !== 'object' || !name) return false
  if (!dom.className) return false
  const classNames = dom.className.split(' ')
  if (classNames.indexOf(name) === -1) return false
  return true
}

export const addClass = (name, dom) => {
  if (!dom || typeof dom !== 'object') return
  let className = dom.className
  if (!className) {
    dom.className = name
    return
  }
  let classNames = className.split(' ')
  if (classNames.indexOf(name) !== -1) return
  dom.className += ` ${name}`
}
export const removeClass = (name, dom) => {
  if (!dom || typeof dom !== 'object') return
  let className = dom.className
  if (!className) return
  let classNames = className.split(' ')
  if (classNames.indexOf(name) === -1) return
  dom.className = classNames.filter((item) => item !== name).join(' ')
}
export const toggleClass = (name, dom) => {
  if (!dom || typeof dom !== 'object') return
  let classNames = (dom.className || '').split(' ')
  if (classNames.indexOf(name) !== -1) removeClass(name, dom)
  else addClass(name, dom)
}
export const getOffset = (el) => {
  let offsetTop = 0
  let offsetLeft = 0
  do {
    if (!isNaN(el.offsetTop)) {
      offsetTop += el.offsetTop
    }
    if (!isNaN(el.offsetLeft)) {
      offsetLeft += el.offsetLeft
    }
    el = el.offsetParent
  } while (el)

  return {
    top: offsetTop,
    left: offsetLeft
  }
}
export const getViewportH = () => {
  let client = window.document.documentElement['clientHeight']
  let inner = window['innerHeight']

  if (client < inner) { return inner } else { return client }
}
export const scrollY = () => {
  return window.pageYOffset || window.document.documentElement.scrollTop
}
export const inViewport = (el, fixH = 0, h = 0) => {
  // let docElem = window.document.documentElement
  let elH = el.offsetHeight
  let scrolled = scrollY()
  let viewed = scrolled + getViewportH()
  let elTop = getOffset(el).top
  let elBottom = elTop + elH
  // if 0, the element is considered in the viewport as soon as it enters.
  // if 1, the element is considered in the viewport only when it's fully inside
  // value in percentage (1 >= h >= 0)

  return (elTop + elH * h + fixH) <= viewed && (elBottom) >= scrolled
}
export const offsetParent = (current, parent, type) => {
  parent = type === 'tag' ? parent.toUpperCase() : parent
  let dom = current
  while (parent) {
    if (type === 'tag') {
      if (current.tagName === parent) parent = null
      else dom = dom.offsetParent
    } else {
      if (dom.className.indexOf(parent) !== -1) parent = null
      else dom = dom.offsetParent
    }
  }
  return dom
}
export const transitionEvent = () => {
  const el = document.createElement('surface')
  const transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
  }
  for (const t in transitions) {
    if (el.style[t] !== undefined) return transitions[t]
  }
}

export const animationIterationEvent = () => {
  const el = document.createElement('surface')
  const animationEnds = {
    'animation': 'animationiteration',
    'OAnimation': 'oAnimationIteration',
    'MozAnimation': 'animationiteration',
    'WebkitAnimation': 'webkitAnimationIteration'
  }
  for (const t in animationEnds) {
    if (el.style[t] !== undefined) return animationEnds[t]
  }
}

export const animationEndEvent = () => {
  const el = document.createElement('surface')
  const animationEnds = {
    'animation': 'animationend',
    'OAnimation': 'oAnimationEnd',
    'MozAnimation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd'
  }
  for (const t in animationEnds) {
    if (el.style[t] !== undefined) return animationEnds[t]
  }
}

export const hasContent = (child, parent, deep = false) => {
  const parentType = objectType(parent)
  if (parentType[0] !== 'object' && parent.indexOf(child) !== -1) return true

  let bool = false
  if (deep && parentType[1] === 'object') {
    let arr = []
    if (parentType[0] === 'array') {
      arr = parent
    } else if (parentType[0] === 'object') {
      arr = Object.keys(parent)
    } else arr = []

    for (const item of arr) {
      if (parentType[0] === 'array' && item.indexOf(child) !== -1) {
        bool = true
        break
      }
      if (parentType[0] === 'object' && parent[item].indexOf(child) !== -1) {
        bool = true
        break
      }
    }
  }
  return bool
}

/**
 * 获取浏览器型号
 */
export const getBrowser = () => {
  if (typeof window === 'undefined') return {}
  const ua = window.navigator.userAgent
  const isIE = window.ActiveXObject !== undefined && ua.indexOf('MSIE') !== -1
  const isFirefox = ua.indexOf('Firefox') !== -1
  const isOpera = window.opr !== undefined
  const isChrome = Boolean(ua.indexOf('Chrome') && window.chrome)
  const isSafari = ua.indexOf('Safari') !== -1 && ua.indexOf('Version') !== -1
  return {
    IE: isIE,
    Firefox: isFirefox,
    Opera: isOpera,
    Chrome: isChrome,
    Safari: isSafari,
    unknow: !isIE && !isFirefox && !isOpera && !isChrome && !isSafari
  }
}

export const reldbIcon = (url, type = 'preview', percent = 50) => {
  if (!url) return url
  let size = 'w_600'
  if (type === 'map') {
    size = 'w_400'
  } else if (type === 'detail') {
    size = 'w_1600'
  } else if (type === 'preview') {
    size = 'w_600'
  } else if (type === 'percent') {
    size = `p_${percent}`
  } else if (type === 'svg') {
    return `${process.env.LDBICON_ORIGIN}${url}`
  }
  return `${process.env.LDBICON_ORIGIN}${url}?x-oss-process=image/resize,${size}`
}

export const transferCoords = (value) => {
  if (!value) return value
  value = parseFloat(value)
  return value / 1e16
}

/**
 * wei to eth
 */
export const weiToEth = (value) => {
  if (!value) return value

  const web3js = store.state.web3.web3Opt.web3js
  value = parseInt(value)

  if (!web3js.fromWei) {
    value = value / 1e18
  } else {
    value = web3js.fromWei(value)
  }
  return parseFloat(parseInt(value).toFixed(4))
}

export const sliceStr = (str, { start = 0, end = 10 } = {}) => {
  if (!str) return str
  return str.toString().slice(start, end)
}

export const formatDecimal = (str, { len = 4, percentage = false } = {}) => {
  if (!str) return str
  if (len === 0) return Math.round(str)
  if (percentage) {
    str = parseFloat(str) * 100
  }
  str = str.toString()
  if (str.split('.')[1]) {
    str = str.split('.')[0] + '.' + str.split('.')[1].slice(0, len)
  }
  return parseFloat(str)
}

/**
 * dateFormat
 */
export const dateFormat = (date, format = 'MMMM Do YYYY, HH:mm:ss') => {
  return dateFnsFormat(date, format)
}

/**
 * timeFormat
 */
export const timeFormat = date => {
  const now = new Date()
  const fDate = new Date(date)
  if (differenceInCalendarISOYears(now, fDate)) return `${differenceInCalendarISOYears(now, fDate)} years ago`
  else if (differenceInCalendarMonths(now, fDate)) return `${differenceInCalendarMonths(now, fDate)} months ago`
  else if (differenceInCalendarISOWeeks(now, fDate)) return `${differenceInCalendarISOWeeks(now, fDate)} weeks ago`
  else if (differenceInCalendarDays(now, fDate)) return `${differenceInCalendarDays(now, fDate)} days ago`
  else if (differenceInHours(now, fDate)) return `${differenceInHours(now, fDate)} hours ago`
  else if (differenceInMinutes(now, fDate)) return `${differenceInMinutes(now, fDate)} minutes ago`
  else if (differenceInSeconds(now, fDate) <= 10) return 'Just now'
  else return `${differenceInSeconds(now, fDate)} seconds ago`
}

/**
 * formatDue
 */

export const formatDue = (obj, len = 2, type = 'single') => {
  const { days, hours, minutes, seconds } = obj
  const arr = []
  const symbol = {
    single: {
      days: 'd',
      hours: 'h',
      minutes: 'm',
      seconds: 's'
    },
    plural: {
      days: ' days',
      hours: ' hours',
      minutes: ' minutes',
      seconds: ' seconds'
    }
  }
  while (arr.length <= len) {
    if ((days && days !== '00') || len >= 4) arr.push(`${days}${symbol[type]['days']}`)
    if (arr.length >= len) break

    if ((hours && hours !== '00') || len >= 3) arr.push(`${hours}${symbol[type]['hours']}`)
    if (arr.length >= len) break

    if ((minutes && minutes !== '00') || len >= 2) arr.push(`${minutes}${symbol[type]['minutes']}`)
    if (arr.length >= len) break

    if (seconds) arr.push(`${seconds}${symbol[type]['seconds']}`)
    if (arr.length >= len) break
  }
  return arr.join(' : ')
}

/**
 * ldb and user Ac
 */
export const nextAC = level => Math.ceil(Math.pow(level * 108, 2) / Math.pow(108, 2) * 10)

export const remainingAC = (level, ac) => Math.ceil(Math.pow(level * 108, 2) / Math.pow(108, 2) * 10) - ac

export const formatLdbType = (type) => {
  const types = [
    'Super Landmark',
    'Business Office Building',
    'Tourist Attraction',
    'Hotel & Food',
    'Museum & Exhibition',
    'University & College',
    'Buddhist & Church',
    'Recreation & Shopping',
    'Residential Quarter',
    'Villa',
    'Park & Square'
  ]
  return types[type - 1]
}

export const getMessageByCode = ({ code, errorMsg = '未知错误' }) => {
  const message = {
    2001: 'Your Ap is not enough, please wait for recovery.',
    2002: 'Tavern\'s Ap is not enough; please change to another',
    2003: 'don\'t cheer by yourself',
    2004: 'quests count is limited',
    2011: 'quest does not exist'
  }
  return message[code] || errorMsg
}

export const filterRegions = (ids, { lang = 'en', len = 2, invserse = false, list = store.state.region.regions } = {}) => {
  if (!list.length) return ' '
  if (objectType(ids)[0] === 'string') return list.filter(item => item._id === ids)[0].name[lang]
  else if (objectType(ids)[0] === 'array') {
    ids = ids.map(id => {
      return list.filter(item => item._id === id)[0].name[lang]
    })
    if (invserse) ids = ids.slice(ids.length - len, ids.length)
    else ids = ids.slice(0, len)
  }
  return ids.join(' ')
}

export const findRegionById = (id, { lang = 'en', list = store.state.region.regions } = {}) => {
  if (!list.length) return ' '
  return list.filter(item => item._id === id)[0].name[lang]
}
