
import store from '@/store'
import { actionTypes } from '@/store/types'
/**
 * loop candy clamied
 */

export const loopCandyClamied = (duration = 15000) => {
  let nowt = 0
  const loopStep = async (timestamp) => {
    if (!nowt || timestamp - nowt > duration) {
      // console.time('loopStep')
      await store.dispatch(`candy/${actionTypes.CANDY_SET_CANDY_CLAIMED}`)
      // console.timeEnd('loopStep')
      nowt = timestamp
      return window.requestAnimationFrame(loopStep)
    }
    return window.requestAnimationFrame(loopStep)
  }
  return window.requestAnimationFrame(loopStep)
}
