const initialState = {
  playBackStyle: 'original',
  frameRate: 10,
  frameRatio: 1.3,
  width: null,
  height: null,
}


export default (state = initialState, action) => {
  switch(action.type) {
    case 'APPLY_VIDEO_PARAMS_AS_SETTINGS':
      return {
        ...state,
        ...action.obj
      }
    default:
      return state
  }
}
