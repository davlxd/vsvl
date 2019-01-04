import React from 'react'
import PropTypes from 'prop-types'

import GenericSnack from '../GenericSnack'
import mobileAndTabletDetector from '../../browsers/mobileAndTabletDetector'

const permissionWording = () => {
  if (mobileAndTabletDetector()) {
    return "Or you need to give this Browser Camera acess in System Settings."
  } else {
    return 'Or if you denied permission request, you can click the icon to the left of the web address to regrant.'
  }
}
const NeedCameraSnack = props => (
  <GenericSnack duration={20000} message={<span id="message-id">We have problems accessing the Webcam, please check if another program is using it. { permissionWording() }</span>} {...props} />
)

NeedCameraSnack.propTypes = {
  on: PropTypes.bool.isRequired,
  off: PropTypes.func.isRequired,
}

export default NeedCameraSnack
