const initialState = {
  consent: null,
  settingsSliderIsOn: false
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
    case 'SETTINGS_SLIDER_ON':
      return {
        ...state,
        settingsSliderIsOn: true,
      }
    case 'SETTINGS_SLIDER_OFF':
      return {
        ...state,
        settingsSliderIsOn: false,
      }
    default:
      return state
  }
}
