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
export const splitAddress = (address, { before = 8, end = 6, symbol = '...' } = {}) => {
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
