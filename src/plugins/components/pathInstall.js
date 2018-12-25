const Vue = require('vue').default
const files = [
  '/reuse/_mobile/navbar',
  '/reuse/_mobile/adSpace',

  '/reuse/tavernPoster',
  '/reuse/dialog/authorize',
  '/reuse/dialog/luckyRules',

  '/content/layout/header/logo',

  '/stories/blockies',
  '/stories/button',
  '/stories/image',
  '/stories/linkSymbol',
  '/stories/pagination',
  '/stories/progress',
  '/stories/dialog/fade',
  '/stories/candyIcon'
]

for (const file of files) {
  const component = require(`${__dirname}/../../components${file}`).default
  component.install = (Vue) => {
    Vue.component(component.name, component)
  }
  Vue.use(component)
}
