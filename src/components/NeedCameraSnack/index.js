import React, { Component } from 'react'
import PropTypes from 'prop-types'

import GenericSnack from '../GenericSnack'

const NeedCameraSnack = props => (
  <GenericSnack duration={10000} message={<span id="message-id">We need Webcam access to work. To grant the access, click the icon to the left of the web address.</span>} {...props} />
)

NeedCameraSnack.propTypes = {
  on: PropTypes.bool.isRequired,
  off: PropTypes.func.isRequired,
}

export default NeedCameraSnack
