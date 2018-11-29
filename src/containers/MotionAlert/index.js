import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Tooltip from '@material-ui/core/Tooltip'

import { withStyles } from '@material-ui/core/styles'

import DirectionsRunIcon from '@material-ui/icons/DirectionsRun'

import { ALTER_SETTING, RECOVER_SETTINGS_FROM_WEB_STORAGE, } from '../../actions'


const styles = theme => ({
  root: {
    zIndex: 4,
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    boxSizing: 'border-box',
    borderStyle: 'solid',
    borderWidth: theme.spacing.unit,
    borderColor: 'red',
    pointerEvents: 'none',
    animationName: 'flash',
    animationTimefunction: 'linear',
    animationIterationCount: 'infinite',
    animationDuration: '2.89s', // this comes from audio length
    opacity: 0,
  },
  motionIcon: {
    position: 'fixed',
    bottom: theme.spacing.unit * 10,
    right: theme.spacing.unit * 3,
    zIndex: 2,
  },
  '@keyframes flash': {
    '0%': { opacity: 0, },
    '50%': { opacity: 1, },
    '100%': { opacity: 0, },
  }
})

class MotionAlert extends Component {
  state = {
    animationOn: true,
  }

  constructor(props) {
    super(props);
    this.url = "/notification-light.mp3"
    this.audio = new Audio(this.url)
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    const { motioning, alertingOnMotion, alertingOnMotionStrategy } = this.props
    if (alertingOnMotion && !prevProps.motioning && motioning && alertingOnMotionStrategy === 'alert-once') {
      this.setState({
        animationOn: false,
      })
      this.setState({
        animationOn: true,
      })
      this.audio.play()
    }

    const sound = () => {
      const { motioning, alertingOnMotion, alertingOnMotionStrategy } = this.props
      this.audio.play()
      if (alertingOnMotion && motioning && alertingOnMotionStrategy === 'keep-alerting') {
        setTimeout(sound, 1000)
      }
    }

    if (alertingOnMotion && motioning && alertingOnMotionStrategy === 'keep-alerting') {
      setTimeout(sound, 0)
    }
  }


  render() {
    const { classes, motioning, alertingOnMotion, alertingOnMotionStrategy } = this.props
    const { animationOn } = this.state

    return (
      <div style={{
        display: motioning && alertingOnMotion ? null : 'none',
        animationName: animationOn ? 'flash' : null,
        animationIterationCount: alertingOnMotionStrategy === 'alert-once' ? 1 : 'infinite'
      }} className={classes.root}>
      </div>
    )
  }
}

MotionAlert.propTypes = {
  classes: PropTypes.object.isRequired,
}


const mapStateToProps = (state) => ({
  motioning: state.streaming.motioning,
  alertingOnMotion: state.settings.alertingOnMotion,
  alertingOnMotionStrategy: state.settings.alertingOnMotionStrategy,
})

const mapDispatchToProps = (dispatch) => ({
})


export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MotionAlert)
)
