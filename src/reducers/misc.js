const initialState = {
  consent: null,
}


export default (state = initialState, action) => {
  switch(action.type) {
    case 'APPLY_WEB_STORAGE_VALUE':
      return {
        ...state,
        [action.name]: action.value
      }
    case 'USER_CLICK_CONSENT':
      return {
        ...state,
        consent: true,
      }
    default:
      return state
  }
}
