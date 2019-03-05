export default {
  data: () => {
    return {
      loading: true
    }
  },
  methods: {
    resetStatus () {
      this.loading = true
    }
  },
  beforeDestroy () {
    this.resetStatus()
  },
  deactivated () {
    this.resetStatus()
  }
}
