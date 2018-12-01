export const LOADING_PROFILE = value => ({
  type: 'LOADING_PROFILE',
  value
})

export const APPLY_WEB_STORAGE_VALUE = (name, value) => ({
  type: 'APPLY_WEB_STORAGE_VALUE',
  name,
  value
})


export const APPLY_VIDEO_PARAMS_AS_SETTINGS = obj => ({
  type: 'APPLY_VIDEO_PARAMS_AS_SETTINGS',
  obj
})

export const RECOVER_SETTINGS_FROM_WEB_STORAGE = value => ({
  type: 'RECOVER_SETTINGS_FROM_WEB_STORAGE',
  value
})


export const USER_CLICK_CONSENT = {
  type: 'USER_CLICK_CONSENT'
}


export const MOTION_DETECTED = {
  type: 'MOTION_DETECTED'
}

export const MOTION_GONE = {
  type: 'MOTION_GONE'
}

export const SAVING_FILES = {
  type: 'SAVING_FILES'
}

export const SAVING_COMPLETE = {
  type: 'SAVING_COMPLETE'
}


export const SETTINGS_SLIDER_ON = {
  type: 'SETTINGS_SLIDER_ON'
}

export const SETTINGS_SLIDER_OFF = {
  type: 'SETTINGS_SLIDER_OFF'
}



export const ALTER_SETTING = (name, value) => ({
  type: 'ALTER_SETTING',
  name,
  value
})
