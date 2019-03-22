
/**
 * layout store types
 */

const mutationTypes = {
  USER_SET_USER_INFO: 'setUserInfo_mutation',
  USER_SET_SINGLE_USER_INFO: 'setSingleUserInfo_mutation',
  USER_SET_USER_TOKEN: 'setUserToken_mutation',
  USER_SET_USERS: 'setUsers_mutation',
  USER_UPT_USER_INFO: 'userUptUserInfo_mutation',
  USER_SET_USER_HOME: 'userSetUserHome_mutation',
  USER_SET_PLAN_BOOSTS: 'userSetPlanBoosts_mutation'
}
const actionTypes = {
  USER_META_LOGIN: 'metaLogin_action',
  USER_SET_USER_BY_TOKEN: 'setUserByToken_action',
  USER_SET_USER_BY_ADDRESS: 'setUserByAddress_action',
  USER_SET_USER_TOKEN: 'setUserToken_action',
  USER_GET_TOKEN_BY_ADDRESS: 'getTokenByAddress_action',
  USER_LOGOUT: 'userLogout_action',
  USER_UPT_USER_PARAMS: 'userUptUserParams_action',
  USER_SET_USER_HOME: 'userSetUserHome_action',
  USER_SET_PLAN_BOOSTS: 'userSetPlanBoosts_action'
}

module.exports = {
  mutationTypes,
  actionTypes
}
