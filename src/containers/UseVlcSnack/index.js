import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import GenericSnack from '../../components/GenericSnack'

class UseVlcSnack extends Component {
  componentDidMount() {
    this.bannerFlag = JSON.parse(localStorage.getItem('banner'))
    this.bannerDisplayedBefore = this.bannerFlag && this.bannerFlag.useVlc
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.on && this.props.on) {
      const newFlag = this.bannerFlag || {}
      newFlag.useVlc = true
      localStorage.setItem('banner', JSON.stringify(newFlag))
      this.bannerDisplayedBefore = true
    }
  }

  render() {
    const {on, ...rest} = this.props
    return (
      <GenericSnack duration={20000} message={<span id="message-id">If you have trouble opening downloaded files, try <img width='15px' src='/logo-vlc.png' alt='VLC'/> <a href='https://www.videolan.org' target='_blank' rel="noopener noreferrer" style={{color: 'inherit'}}>VLC</a> or this browser itself, see <a href='/faq' target='_blank' rel="noopener noreferrer" style={{color: 'inherit'}}>FAQ</a> for details.</span>} {...rest} on={this.bannerDisplayedBefore ? false : on}/>
    )
  }
}

UseVlcSnack.propTypes = {
  on: PropTypes.bool.isRequired,
  off: PropTypes.func.isRequired,
}


const mapStateToProps = (state) => ({
  consent: state.misc.consent
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UseVlcSnack)
