import React from 'react'
import PropTypes from 'prop-types'

import GenericOneTimeSnack from '../GenericOneTimeSnack'

const UseVlcSnack = props => (
  <GenericOneTimeSnack flagName='useVlc' duration={20000} message={<span id="message-id">If you have trouble opening downloaded files, try <img width='15px' src='/logo-vlc.png' alt='VLC'/> <a href='https://www.videolan.org' target='_blank' rel="noopener noreferrer" style={{color: 'inherit'}}>VLC</a> or Chrome browser, see <a href='/faq' target='_blank' rel="noopener noreferrer" style={{color: 'inherit'}}>FAQ</a> for details.</span>} {...props} />
)

UseVlcSnack.propTypes = {
  on: PropTypes.bool.isRequired,
  off: PropTypes.func.isRequired,
}

export default UseVlcSnack
