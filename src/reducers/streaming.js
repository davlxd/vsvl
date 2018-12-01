const initialState = {
  motioning: false,
  saving: false
}


export default (state = initialState, action) => {
  switch(action.type) {
    case 'MOTION_DETECTED':
      return {
        ...state,
        motioning: true
      }
    case 'MOTION_GONE':
      return {
        ...state,
        motioning: false
      }
    case 'SAVING_FILES':
      return {
        ...state,
        saving: true
      }
    case 'SAVING_COMPLETE':
      return {
        ...state,
        saving: false
      }
    default:
      return state
  }
}
