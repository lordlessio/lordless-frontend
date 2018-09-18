import { addClass, hasClass } from 'utils/tool'
export default {
  computed: {
    isMobile () {
      return this.$root.$children[0].isMobile
    }
  },
  destroyed () {
    if ((this.isMobile || this.fixed) && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.isMobile || this.fixed) {
        document.body.appendChild(this.$el)
        if (!hasClass('fixed', this.$el)) {
          addClass('fixed', this.$el)
        }
      }
    })
  }
}
