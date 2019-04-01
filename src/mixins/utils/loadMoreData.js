export default {
  data: () => {
    return {
      scrollHandle: null,
      loadMoreLoading: false
    }
  },
  methods: {
    // 获取更多 records
    async loadMoreData (cb) {
      this.loadMoreLoading = true
      const info = this.loadDatas
      console.log('------ loadMoreData info', info)
      const pn = info.pn + 1
      const result = (await this.getDataMethod({ pn })) || {}
      const { list = [], ps = 10 } = result
      // const { list = [], ps = info.ps, total = 0 } = (await this.getDataMethod({ pn })) || {}

      let noMore = false
      if (list.length < ps) {
        noMore = true
      }
      this.$set(this, 'loadDatas', Object.assign({}, info, result, {
        list: info.list.concat(list),
        pn,
        ps,
        noMore
      }))
      this.loadMoreLoading = false
      return cb && cb()
    },

    /**
     * scroll 监听事件
     */
    scrollListenerFunc ({ bool = false, bottom = 80, pHeight = document.body.offsetHeight } = {}) {
      this.scrollHandle && document.removeEventListener('scroll', this.scrollHandle)
      this.scrollHandle = null
      if (this.disabledScroll) return

      const box = this.$refs['lordless-load-more-box']
      let bHeight = box ? box.offsetHeight : 0
      console.log(' --- scroll', bHeight, bottom, pHeight)
      // 如果 bHeight 不存在或者 bHeight - bottom 小于 pHeight, return
      if (!bHeight || bHeight - bottom < pHeight) return

      const handleFunc = () => {
        if (bool || this.loadDatas.noMore) return
        if (!bHeight) bHeight = box.offsetHeight
        const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop

        // 如果页面上滑到达指定条件位置
        // 读取更多数据
        if (scrollTop + pHeight + bottom > bHeight) {
          bool = true
          this.loadMoreData(() => {
            this.$nextTick(() => {
              bool = false
              bHeight = box.offsetHeight
            })
          })
        }
      }
      handleFunc()

      this.scrollHandle = handleFunc

      this.$nextTick(() => {
        document.addEventListener('scroll', this.scrollHandle)
      })
    }
  }
  // beforeDestory () {
  //   this.scrollHandle && document.removeEventListener('scroll', this.scrollHandle)
  // },
  // deactivated () {
  //   this.scrollHandle && document.removeEventListener('scroll', this.scrollHandle)
  // }
}
