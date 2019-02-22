import { scrollTo as _scrollTo } from './index'
/*
 * Tween.js
 * t: current time（当前时间）；
 * b: beginning value（初始值）；
 * c: change in value（变化量）；
 * d: duration（持续时间）。
 * you can visit 'http://easings.net/zh-cn' to get effect
*/
export const Tween = {
  Linear: function (t, b, c, d) { return c * t / d + b },
  Quad: {
    easeIn: function (t, b, c, d) {
      return c * (t /= d) * t + b
    },
    easeOut: function (t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b
    },
    easeInOut: function (t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t + b
      return -c / 2 * ((--t) * (t - 2) - 1) + b
    }
  },
  Cubic: {
    easeIn: function (t, b, c, d) {
      return c * (t /= d) * t * t + b
    },
    easeOut: function (t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b
    },
    easeInOut: function (t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t + b
      return c / 2 * ((t -= 2) * t * t + 2) + b
    }
  },
  Quart: {
    easeIn: function (t, b, c, d) {
      return c * (t /= d) * t * t * t + b
    },
    easeOut: function (t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b
    },
    easeInOut: function (t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b
    }
  },
  Quint: {
    easeIn: function (t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b
    },
    easeOut: function (t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b
    },
    easeInOut: function (t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b
      return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
    }
  },
  Sine: {
    easeIn: function (t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b
    },
    easeOut: function (t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b
    },
    easeInOut: function (t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
    }
  },
  Expo: {
    easeIn: function (t, b, c, d) {
      return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
    },
    easeOut: function (t, b, c, d) {
      return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
    },
    easeInOut: function (t, b, c, d) {
      if (t === 0) return b
      if (t === d) return b + c
      if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b
    }
  },
  Circ: {
    easeIn: function (t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
    },
    easeOut: function (t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
    },
    easeInOut: function (t, b, c, d) {
      if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b
      return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
    }
  },
  Elastic: {
    easeIn: function (t, b, c, d, a, p) {
      var s
      if (t === 0) return b
      if ((t /= d) === 1) return b + c
      if (typeof p === 'undefined') p = d * 0.3
      if (!a || a < Math.abs(c)) {
        s = p / 4
        a = c
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a)
      }
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
    },
    easeOut: function (t, b, c, d, a, p) {
      var s
      if (t === 0) return b
      if ((t /= d) === 1) return b + c
      if (typeof p === 'undefined') p = d * 0.3
      if (!a || a < Math.abs(c)) {
        a = c
        s = p / 4
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a)
      }
      return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b)
    },
    easeInOut: function (t, b, c, d, a, p) {
      var s
      if (t === 0) return b
      if ((t /= d / 2) === 2) return b + c
      if (typeof p === 'undefined') p = d * (0.3 * 1.5)
      if (!a || a < Math.abs(c)) {
        a = c
        s = p / 4
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a)
      }
      if (t < 1) return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
      return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b
    }
  },
  Back: {
    easeIn: function (t, b, c, d, s) {
      if (typeof s === 'undefined') s = 1.70158
      return c * (t /= d) * t * ((s + 1) * t - s) + b
    },
    easeOut: function (t, b, c, d, s) {
      if (typeof s === 'undefined') s = 1.70158
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    },
    easeInOut: function (t, b, c, d, s) {
      if (typeof s === 'undefined') s = 1.70158
      if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b
      return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b
    }
  },
  Bounce: {
    easeIn: function (t, b, c, d) {
      return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b
    },
    easeOut: function (t, b, c, d) {
      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b
      } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b
      } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b
      } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b
      }
    },
    easeInOut: function (t, b, c, d) {
      if (t < d / 2) {
        return Tween.Bounce.easeIn(t * 2, 0, c, d) * 0.5 + b
      } else {
        return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
      }
    }
  }
}

/**
 * scroll To Top 动画
 * @param target 移动的dom，默认为 documentElement
 * @param before 起始位置
 * @param end 结束位置
 * @param duration 执行时间
 * @param lname 动画名称
 * @param ltype 动画类型
 */
export const scrollToTop = ({ target = null, before = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop, end = 0, duration = 300, lname = 'Bounce', ltype = 'easeInOut' } = {}, cb) => {
  let st = 0
  const step = (timestamp) => {
    if (!st) st = timestamp
    const t = timestamp - st

    // const s = Tween[lname][ltype](t, 0, before - end, duration)
    // let top = before > end ? before - s + end : before - s

    let top = before - Tween[lname][ltype](t, 0, before - end, duration) + end

    // console.log('top', before, Tween[lname][ltype](t, 0, before - end, duration), end, top)

    if (top <= end) top = end

    if (target) target.scrollTop = top
    else _scrollTo(top)
    if (t >= duration) {
      if (cb) return cb()
      return true
    }
    return window.requestAnimationFrame(step)
  }
  return window.requestAnimationFrame(step)
}

export const scrollToLeft = (target = null, { before = 0, end = 0, duration = 500, lname = 'Bounce', ltype = 'easeInOut' } = {}, cb) => {
  if (!target) return
  let st = 0
  const step = (timestamp) => {
    if (!st) st = timestamp
    const t = timestamp - st

    // const s = Tween[lname][ltype](t, 0, before - end, duration)
    // let top = before > end ? before - s + end : before - s
    const _func = ltype.toLocaleLowerCase() === 'linear' ? Tween['Linear'] : Tween[lname][ltype]

    let left = _func(t, 0, end - before, duration)
    console.log('---- left', left, _func(t, 0, end - before, duration))

    // console.log('top', before, Tween[lname][ltype](t, 0, before - end, duration), end, top)

    if (left >= end) left = end
    // console.log('===== left', left)

    if (target) target.scrollLeft = left
    if (t >= duration) {
      if (cb) return cb()
      return true
    }
    return window.requestAnimationFrame(step)
  }
  return window.requestAnimationFrame(step)
}

// 已知抛物线两个点的坐标，求抛物线 二次项系数 Quadratic
export const getBezierQuadratic = (a, b) => {
  const x1 = a.x
  const y1 = a.y
  const x2 = b.x
  const y2 = b.y
  return (x1 * y2 - y1 * x2) / (x1 * x2 * x2 - x1 * x1 * x2)
}

// 获取抛物线顶点
export const getVertex = ({ v1, v2 = { x: 0, y: 0 } } = {}) => {
  if (!v1) return null
  const x2 = v1.x
  const y2 = v1.y
  const vx = x2 - v2.x
  const vy = y2 - v2.y
  const rate = vx > 0 ? 1 : -1

  // 圆的半径
  // x1 * x1 + x2 * x2 = r * r
  const r = Math.sqrt(vx * vx + vy * vy) / 2
  const vertex = {}

  // vertex.x * vertex.x = r * r - (vy / 2) * (vy / 2) = r * r - (vy * vy / 4)
  vertex.x = rate * (Math.sqrt(r * r - (vy * vy / 4)))
  vertex.y = (r - (vy / 2))
  return vertex
}

/**
 * 抛物线公式
 * @param {Number} rate 方向
 * @param {Number} time 当前时间
 * @param {Number} duration 持续时间
 * @param {Number} a 纵向加速度
 * @param {Number} sx 水平位移量
 * @param {Number} sy 垂直位移量
 * @return {Object} x, y 坐标
 */
export const bezierPath = ({ time = 0, duration = 1000, a = 5000, sx = 1000, sy = 0 } = {}) => {
  const ta = duration / 1000
  const t = time / 1000
  sy = Math.abs(sy)

  // 根据总时间求出 x 轴及 y 轴方向的初速度
  const v0x = sx / ta
  const v0y = sy / ta - 1 / 2 * a * ta

  // 物理抛物线
  // s = v1 * t + 1 / 2 * a * t * t
  const x = v0x * t
  const y = v0y * t + 1 / 2 * a * t * t
  return { x, y }
}

/**
 * 糖果领取动画
 * @param {Number} a 二次项系数
 * @param {Number} speed 动画速率
 */
export const receiveAnimate = (current, target, { before = -1, duration = 1000 } = {}, cb) => {
  const scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft)

  const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop)
  // 四边缘的坐标
  const currentEle = current.getBoundingClientRect()
  const targetEle = target.getBoundingClientRect()

  // 移动元素的中心点坐标
  const currentCenter = {
    x: currentEle.left + (currentEle.right - currentEle.left) / 2 + scrollLeft,
    y: currentEle.top + (currentEle.bottom - currentEle.top) / 2 + scrollTop
  }

  // 目标元素位置
  const targetCenter = {
    x: targetEle.left + (targetEle.right - targetEle.left) / 11 * 5 + scrollLeft,
    y: targetEle.top + (targetEle.bottom - targetEle.top) / 11 * 5 + scrollTop
  }

  // 相对坐标位置
  const { sx, sy } = {
    sx: targetCenter.x - currentCenter.x,
    sy: currentCenter.y - targetCenter.y
  }

  let startt = 0

  // timestamp 时间戳,当前动画执行了多久
  const step = (timestamp) => {
    if (!startt) startt = timestamp
    const time = timestamp - startt
    let { x, y } = bezierPath({ time, duration, a: 6000, sx, sy })

    if (Math.abs(x) >= Math.abs(sx)) {
      x = sx
      y = y > 0 ? Math.abs(sy) : -Math.abs(sy)
    }

    current.style.transform = `translate3d(${x}px, ${y}px, 0) translateZ(0)`

    if (x !== sx && duration > time) {
      window.requestAnimationFrame(step)
    } else {
      const cdata = { coords: { x, y } }
      if (cb) cb(cdata)
    }
  }
  return window.requestAnimationFrame(step)
}
