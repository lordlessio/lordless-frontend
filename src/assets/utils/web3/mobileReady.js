import { mobileBool } from 'utils/tool'

function initCdnWeb3 () {
  return new Promise((resolve, reject) => {
    if (window.web3) return resolve()
    const el = document.createElement('script')
    el.src = 'https://lordless-sh.oss-cn-shanghai.aliyuncs.com/static/js/web3.min.js'
    el.type = 'text/javascript'
    el.async = true
    document.head.appendChild(el)
    el.onload = () => {
      resolve()
    }
    el.onerror = (e) => reject(new Error(e))
  })
}

const checkForWeb3 = () => {
  // alert('checkForWeb3')
  return new Promise(resolve => {
    const loopFunc = ({ duration = 100, time = 3000 } = {}) => {
      let _start = 0
      let start = 0
      const step = (timeStamp) => {
        if (!_start) _start = timeStamp
        if (timeStamp - start < duration) return window.requestAnimationFrame(step)
        console.log('--------- frame')
        if (timeStamp - _start >= time) {
          window.cancelAnimationFrame(step)
          return resolve(true)
        }
        start = timeStamp
        if (window.web3 && web3.currentProvider) {
          window.startDApp && window.startDApp()
          window.cancelAnimationFrame(step)
          return resolve(true)
        }
        return window.requestAnimationFrame(step)
      }
      return window.requestAnimationFrame(step)
    }
    return loopFunc()
  })
}

export const mobileReady = async () => {
  return new Promise(async resolve => {
    if (window.imToken) {
      initCdnWeb3().then(d => {
        return resolve()
      })
    } else if (window.coco || typeof web3 !== 'undefined') {
      // alert('  init ---- 1')
      return resolve()
    } else {
      // alert('  init ---- 4')
      if (!mobileBool()) return resolve()
      if (await checkForWeb3()) {
        return resolve()
      }
      // document.addEventListener('load', checkForWeb3, false)

      window.addEventListener('sdkReady', function () {
        return resolve()
      })
    }
  })
}
