const Vue = require('vue').default
const files = [
  '/reuse/_mobile/navbar',

  '/stories/blockies',
  '/stories/button',
  '/stories/image',
  '/stories/linkSymbol',
  '/stories/pagination',
  '/stories/progress'
]

for (const file of files) {
  const component = require(`${__dirname}/../../components${file}`).default
  component.install = (Vue) => {
    Vue.component(component.name, component)
  }
  Vue.use(component)
}
