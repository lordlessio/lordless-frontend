
/**
 * layout store types
 */

const mutationTypes = {
  LAYOUT_SET_HEADER_OPTIONS: 'layoutSetHeaderOpts',
  LAYOUT_SET_FOOTER_OPTIONS: 'layoutSetFooterOpts',
  LAYOUT_SET_APP_OPTIONS: 'layoutSetAppOpts',
  LAYOUT_SET_BLURS: 'layoutSetBlurs',
  LAYOUT_SET_MESSAGE_TIP: 'layoutSetMsgTip',
  LAYOUT_SET_META_OPEN: 'layoutSetMetaOpen',
  LAYOUT_SET_ACTIVATED_OPTIONS: 'layoutSetActivated',
  LAYOUT_SET_PHISTORY: 'layoutSetPHistory',
  // LAYOUT_SET_POP_DIRECTION: 'layoutSetPopDirection',
  LAYOUT_SET_POP_TRANSITION: 'layoutSetPopTransition',
  LAYOUT_SET_TABBAR_OPTIONS: 'layoutSetTabbarOptions'
}
const actionTypes = {
  LAYOUT_SET_APP_OPTIONS: 'layoutSetAppOpts_action',
  LAYOUT_SET_BLURS: 'layoutSetBlurs_action',
  LAYOUT_SET_META_OPEN: 'layoutSetMetaOpen_action'
}

module.exports = {
  mutationTypes,
  actionTypes
}
