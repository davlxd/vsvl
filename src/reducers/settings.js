const initialState = {
  playbackDisplayMode: 'extend',
  frameRate: 10,
  frameRatio: 1.3,
  width: null,
  height: null,

  alertingOnMotion: true,
  alertingOnMotionStrategy: 'alert-once',

  savingToFiles: false,
  savingRawVideoFiles: false,
  savingToFilesPrefix: 'videosurveillance.webcamp-vclip',
  savingToFilesOnlyMotionDetected: true,
  savingToFilesStrategy: 'time',
  splitFileSize: '10',
  splitFileTime: 'on-the-1-min',
}


export default (state = initialState, action) => {
  switch(action.type) {
    case 'APPLY_VIDEO_PARAMS_AS_SETTINGS':
      return {
        ...state,
        ...action.obj
      }
    case 'RECOVER_SETTINGS_FROM_WEB_STORAGE':
      return {
        ...state,
        ...action.value
      }
    case 'ALTER_SETTING':
      if (action.name === 'savingToFilesStrategy' && action.value === 'motion-detected') {
        return {
          ...state,
          savingToFilesOnlyMotionDetected: true,
          [action.name]: action.value,
        }
      } else if (action.name === 'savingToFilesOnlyMotionDetected' && state.savingToFilesStrategy === 'motion-detected') {
        return {
          ...state,
          savingToFilesOnlyMotionDetected: true,
        }
      }
      return {
        ...state,
        [action.name]: action.value
      }
    default:
      return state
  }
}
