import React from 'react'
import PropTypes from 'prop-types'

import GenericSnack from '../GenericSnack'

const SlowLoadingSnack = props => (
  <GenericSnack duration={4000} message={<span id="message-id">Web app is loading, please be patient.</span>} {...props} />
)

SlowLoadingSnack.propTypes = {
  on: PropTypes.bool.isRequired,
  off: PropTypes.func.isRequired,
}

export default SlowLoadingSnack
