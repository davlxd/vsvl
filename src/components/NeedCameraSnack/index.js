import React from 'react'
import PropTypes from 'prop-types'

import GenericSnack from '../GenericSnack'

const NeedCameraSnack = props => (
  <GenericSnack duration={20000} message={<span id="message-id">We have problems accessing the Webcam, please check if another program is using it. If you accidentally denied the permission request, you can click the icon to the left of the web address to regrant.</span>} {...props} />
)

NeedCameraSnack.propTypes = {
  on: PropTypes.bool.isRequired,
  off: PropTypes.func.isRequired,
}

export default NeedCameraSnack
