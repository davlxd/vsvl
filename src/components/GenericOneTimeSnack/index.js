import React, { Component } from 'react'
import PropTypes from 'prop-types'

import GenericSnack from '../GenericSnack'

class GenericOneTimeSnack extends Component {
  componentDidMount() {
    const { flagName } = this.props

    this.bannerFlag = JSON.parse(localStorage.getItem('banner'))
    this.bannerDisplayedBefore = this.bannerFlag && this.bannerFlag[flagName]
  }

  off() {
    const { flagName } = this.props

    const newFlag = this.bannerFlag || {}
    newFlag[flagName] = true
    localStorage.setItem('banner', JSON.stringify(newFlag))
    this.bannerDisplayedBefore = true
  }

  render() {
    const { on, off, flagName, ...rest } = this.props
    return (
      <GenericSnack on={this.bannerDisplayedBefore ? false : on} off={() => { this.off(); off() }} { ...rest } />
    )
  }
}

GenericOneTimeSnack.propTypes = {
  on: PropTypes.bool.isRequired,
  off: PropTypes.func.isRequired,
  flagName: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  message: PropTypes.object.isRequired,
}

export default GenericOneTimeSnack
