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


export const USER_CLICK_CONSENT = {
  type: 'USER_CLICK_CONSENT'
}


export const MOTION_DETECTED = {
  type: 'MOTION_DETECTED'
}

export const MOTION_GONE = {
  type: 'MOTION_GONE'
}
