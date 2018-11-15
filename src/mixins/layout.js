
import { addClass, removeClass } from 'utils/tool'
export default {
  methods: {
    prohibitScroll () {
      addClass('overflow-hidden', document.getElementById('lordless'))
    },
    freeScroll () {
      removeClass('overflow-hidden', document.getElementById('lordless'))
    }
  }
}
