import React from 'react'
import PropTypes from 'prop-types'

import GenericSnack from '../GenericSnack'

const BrowserCannotSavingFilesSnack = props => (
  <GenericSnack duration={10000} message={<span id="message-id">This browser doesn't support this, please check <a href='/browser-matrix' target='_blank' rel="noopener noreferrer" style={{color: 'inherit'}}>Browser Matrix</a> for details.</span>} {...props} />
)

BrowserCannotSavingFilesSnack.propTypes = {
  on: PropTypes.bool.isRequired,
  off: PropTypes.func.isRequired,
}

export default BrowserCannotSavingFilesSnack
