const initialState = {
  playBackStyle: 'original',
  frameRate: 10,
  frameRatio: 1.3,
  width: null,
  height: null,

  alertingOnMotion: true,
  alertingOnMotionStrategy: 'alert-once',

  savingToFiles: false,
  savingToFilesPrefix: 'videosurveillance.webcamp-vclip-',
  savingToFilesOnlyMotionDetected: true,
  savingToFilesStrategy: 'file-size',
  splitFileSize: '10',
  splitFileTime: 'every-hour',
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
      return {
        ...state,
        [action.name]: action.value
      }
    default:
      return state
  }
}
