import React from 'react'
import PropTypes from 'prop-types'

import GenericOneTimeSnack from '../GenericOneTimeSnack'

const SavingExplainSnack = props => (
  <GenericOneTimeSnack flagName='savingExplain' duration={10000} message={<span id="message-id">Video clips will be downloaded periodically on finishing preparing.</span>} {...props} />
)

SavingExplainSnack.propTypes = {
  on: PropTypes.bool.isRequired,
  off: PropTypes.func.isRequired,
}

export default SavingExplainSnack
