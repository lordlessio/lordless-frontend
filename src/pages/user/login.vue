<template>
  <div>
    <div class="user">
      <div>nickName:{{ userInfo.nickName }}</div>
      <div>mobile:{{ userInfo.mobile }}</div>
      <div>address:{{ userInfo.address }}</div>
    </div>
    <div class="btn">
      <MyButton @click.native="loginFunc">登陆啊</MyButton>
    </div>
  </div>
</template>

<script>
import { login } from 'api'
import MyButton from '@/stories/button'
import { mapActions, mapState } from 'vuex'
import { actionTypes } from '@/store/typeNames'
export default {
  components: {
    MyButton
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ])
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_SET_USER_BY_TOKEN,
      actionTypes.USER_SET_USER_TOKEN
    ]),

    loginFunc () {
      const { web3js, address } = this.$parent.web3Opt
      if (!address) return
      const str = web3js.toHex('lordless')
      // 调起 metamask personal_sign 方法
      web3js.personal.sign(str, web3js.eth.defaultAccount, async (err, result) => {
        if (!err) {
          if (result) this.login(result, address)
        }
      })
    },
    async login (sigStr, address) {
      const res = await login({ sigStr, address })
      if (res.code === 1000) {
        this.setUserToken({ address, token: res.token })
        this.setUserByToken()
      }
      console.log('-----res', res)
    }
  },
  mounted () {
    console.log('actionTypes', actionTypes)
  }
}
</script>

<style lang="scss">
.btn {
  color: blue;
}
</style>
