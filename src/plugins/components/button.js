import Vue from 'vue'
import LordlessButton from '@/components/stories/button'

/* istanbul ignore next */
LordlessButton.install = function (Vue) {
  Vue.component(LordlessButton.name, LordlessButton)
}

Vue.use(LordlessButton)
