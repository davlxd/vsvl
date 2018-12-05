import React from 'react'
import PropTypes from 'prop-types'

import GenericSnack from '../GenericSnack'

const EncodingCouldTakeLongTimeSnack = props => (
  <GenericSnack duration={3000} message={<span id="message-id">Preparing a video file this long could take a very long time.</span>} {...props} />
)

EncodingCouldTakeLongTimeSnack.propTypes = {
  on: PropTypes.bool.isRequired,
  off: PropTypes.func.isRequired,
}

export default EncodingCouldTakeLongTimeSnack
