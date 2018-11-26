const initialState = {
  motioning: false
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
    default:
      return state
  }
}
