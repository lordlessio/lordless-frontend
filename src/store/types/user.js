
/**
 * layout store types
 */

const mutationTypes = {
  USER_SET_USER_INFO: 'setUserInfo',
  USER_SET_UID_INFO: 'setUidInfo',
  USER_SET_USER_TOKEN: 'setUserToken',
  USER_SET_USERS: 'setUsers'
}
const actionTypes = {
  USER_SET_USER_BY_TOKEN: 'setUserByToken',
  USER_SET_USER_BY_ADDRESS: 'setUserByAddress',
  USER_SET_USER_BY_ID: 'setUserById',
  USER_SET_USER_TOKEN: 'setUserToken',
  USER_GET_TOKEN_BY_ADDRESS: 'getTokenByAddress',
  USER_LOGOUT: 'userLogout'
}

module.exports = {
  mutationTypes,
  actionTypes
}
