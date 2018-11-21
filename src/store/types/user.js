
/**
 * layout store types
 */

const mutationTypes = {
  USER_SET_USER_INFO: 'setUserInfo',
  USER_SET_SINGLE_USER_INFO: 'setSingleUserInfo',
  USER_SET_USER_TOKEN: 'setUserToken',
  USER_SET_USERS: 'setUsers',
  USER_UPT_USER_INFO: 'userUptUserInfo',
  USER_SET_USER_HOME: 'userSetUserHome'
}
const actionTypes = {
  USER_META_LOGIN: 'metaLogin',
  USER_SET_USER_BY_TOKEN: 'setUserByToken',
  USER_SET_USER_BY_ADDRESS: 'setUserByAddress',
  USER_SET_USER_TOKEN: 'setUserToken',
  USER_GET_TOKEN_BY_ADDRESS: 'getTokenByAddress',
  USER_LOGOUT: 'userLogout',
  USER_UPT_USER_PARAMS: 'userUptUserParams',
  USER_SET_USER_HOME: 'userSetUserHome'
}

module.exports = {
  mutationTypes,
  actionTypes
}
