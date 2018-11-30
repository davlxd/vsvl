import React, { Component } from 'react'
import { connect } from 'react-redux'

import ConsentDialog from '../ConsentDialog'
import VideoSurvl from '../VideoSurvl'
import SettingsSlider from '../SettingsSlider'
import MotionIndicator from '../MotionIndicator'
import MotionAlert from '../MotionAlert'

import { APPLY_WEB_STORAGE_VALUE, } from '../../actions'


class Home extends Component {
  componentDidMount() {
    this.loadWebStorageValue()
  }

  loadWebStorageValue() {
    const { applyWebStorageValue } = this.props

    applyWebStorageValue('consent', localStorage.getItem('consent') === 'true')
    applyWebStorageValue('v', Number(localStorage.getItem('v')))
  }


  render() {
    const { consent, } = this.props
    return (
      <div>
        <ConsentDialog />
        { consent ? <VideoSurvl /> : null }
        <MotionIndicator />
        <SettingsSlider />
        <MotionAlert />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  consent: state.misc.consent
})

const mapDispatchToProps = (dispatch) => ({
  applyWebStorageValue: (name, value) => {
    dispatch(APPLY_WEB_STORAGE_VALUE(name, value))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
