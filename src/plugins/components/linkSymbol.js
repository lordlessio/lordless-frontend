import Vue from 'vue'
import LinkSymbol from '@/components/stories/linkSymbol'

/* istanbul ignore next */
LinkSymbol.install = function (Vue) {
  Vue.component(LinkSymbol.name, LinkSymbol)
}

Vue.use(LinkSymbol)
