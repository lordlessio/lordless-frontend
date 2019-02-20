const Vue = require('vue').default
const files = [
  '/reuse/_mobile/navbar',
  '/reuse/_mobile/adSpace',

  '/reuse/tavernPoster',
  '/reuse/dialog/authorize',
  '/reuse/dialog/luckyblock/rules',
  '/reuse/dialog/luckyblock/conditions',
  '/reuse/dialog/plan/glossary',

  '/content/layout/header/logo',

  '/stories/blockies',
  '/stories/button',
  '/stories/checkbox',
  '/stories/image',
  '/stories/linkSymbol',
  '/stories/pagination',
  '/stories/progress',
  '/stories/dialog/fade',
  '/stories/dialog/popup',
  '/stories/candyIcon'
]

for (const file of files) {
  const component = require(`${__dirname}/../../components${file}`).default
  component.install = (Vue) => {
    Vue.component(component.name, component)
  }
  Vue.use(component)
}
