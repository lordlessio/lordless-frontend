<template>
  <div>
    <div class="user">
      <div>nickName:{{ userInfo.nickName }}</div>
      <div>mobile:{{ userInfo.mobile }}</div>
      <div>address:{{ userInfo.address }}</div>
    </div>
    <div class="btn">
      <MyButton @click.native="loginFunc">登陆啊</MyButton>
      <MyButton @click.native="logoutFunc">注销</MyButton>
    </div>
  </div>
</template>

<script>
import { login, logout } from 'api'
import MyButton from '@/stories/button'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    MyButton
  },
  computed: {
    ...mapState('user', {
      userInfo: 'userInfo'
    })
  },
  methods: {
    ...mapActions('user', {
      getUserByToken: 'GET_USER_BY_TOKEN'
    }),
    loginFunc () {
      if (!web3js.eth.accounts[0]) return
      const str = web3js.toHex('lordless')
      // 调起 metamask personal_sign 方法
      web3js.currentProvider.sendAsync({ id: 1, method: 'personal_sign', params: [web3js.eth.accounts[0], str] }, (err, res) => {
        if (!err) {
          if (res.result) this.login(res.result)
        }
      })
    },
    logoutFunc () {
      logout()
    },
    async login (sigStr) {
      const res = await login({ sigStr })
      this.getUserByToken()
      console.log('-----res', res)
    }
  },
  mounted () {

  }
}
</script>

<style lang="scss">
.btn {
  color: blue;
}
</style>
