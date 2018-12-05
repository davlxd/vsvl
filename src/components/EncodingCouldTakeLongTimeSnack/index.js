import React from 'react'
import PropTypes from 'prop-types'

import GenericSnack from '../GenericSnack'

const EncodingCouldTakeLongTimeSnack = props => (
  <GenericSnack duration={3000} message={<span id="message-id">Preparing a video file this long could take a very long time, see <a href='/faq' target='_blank' rel="noopener noreferrer" style={{color: 'inherit'}}>here</a> for details.</span>} {...props} />
)

EncodingCouldTakeLongTimeSnack.propTypes = {
  on: PropTypes.bool.isRequired,
  off: PropTypes.func.isRequired,
}

export default EncodingCouldTakeLongTimeSnack
