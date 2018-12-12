import Clipboard from 'clipboard'
export default {
  data: () => {
    return {
      clipBool: false
    }
  },
  watch: {
    clipBool (val) {
      if (val) {
        setTimeout(() => {
          this.clipBool = false
        }, 1500)
      }
    }
  },
  methods: {
    // 初始化 黏贴板
    initClipboard () {
      const clip = new Clipboard('#copy-link')
      clip.on('success', (e) => {
        this.clipBool = true
        e.clearSelection()
      })
    }
  },
  mounted () {
    this.initClipboard()
  }
}
