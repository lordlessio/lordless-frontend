
/**
 * layout store types
 */

const mutationTypes = {
  USER_SET_USER_INFO: 'setUserInfo',
  USER_SET_UID_INFO: 'setUidInfo',
  USER_SET_USER_TOKEN: 'setUserToken',
  USER_SET_USERS: 'setUsers',
  USER_SET_USER_EXPIRED: 'setUserExpired'
}
const actionTypes = {
  USER_META_LOGIN: 'metaLogin',
  USER_SET_USER_BY_TOKEN: 'setUserByToken',
  USER_SET_USER_BY_ADDRESS: 'setUserByAddress',
  USER_SET_USER_BY_ID: 'setUserById',
  USER_SET_USER_TOKEN: 'setUserToken',
  USER_GET_TOKEN_BY_ADDRESS: 'getTokenByAddress',
  USER_LOGOUT: 'userLogout',
  USER_SET_USER_EXPIRED: 'setUserExpired'
}

module.exports = {
  mutationTypes,
  actionTypes
}
