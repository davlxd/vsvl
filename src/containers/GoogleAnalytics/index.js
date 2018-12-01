import React, { Component } from 'react'
import { connect } from 'react-redux'

import ReactGA from 'react-ga'


const trackingId = 'UA-130187164-1'

class GoogleAnalytics extends Component {
  componentDidMount() {
    if (this.props.consent) {
      ReactGA.initialize(trackingId)
      ReactGA.pageview(window.location.pathname + window.location.search)
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.consent && this.props.consent) {
      ReactGA.initialize(trackingId)
      ReactGA.pageview(window.location.pathname + window.location.search)
    }

    if (!prevProps.settingsSliderIsOn && this.props.settingsSliderIsOn) {
      ReactGA.event({
          category: 'User',
          action: 'settings-slider-on'
      })
    }
  }

  render() {
    return (
      <div></div>
    )
  }
}

const mapStateToProps = (state) => ({
  consent: state.misc.consent,
  settingsSliderIsOn: state.misc.settingsSliderIsOn,
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleAnalytics)
