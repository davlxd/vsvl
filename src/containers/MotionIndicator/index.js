import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'

import DirectionsRunIcon from '@material-ui/icons/DirectionsRun'

import { ALTER_SETTING, RECOVER_SETTINGS_FROM_WEB_STORAGE, } from '../../actions'


const styles = theme => ({
  motionIcon: {
    position: 'fixed',
    bottom: theme.spacing.unit * 10,
    right: theme.spacing.unit * 3,
    zIndex: 2,
    animation: 'flash linear 2s infinite',
  },
  '@keyframes flash': {
    '0%': { opacity: 1, },
    '50%': { opacity: .1, },
    '100%': { opacity: 1, },
  }
})

class MotionIndicator extends Component {
  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
  }


  render() {
    const { classes, motioning } = this.props

    return (
      <DirectionsRunIcon className={classes.motionIcon} style={{display: motioning ? null : 'none'}} color="action" fontSize="large"/>
    )
  }
}

MotionIndicator.propTypes = {
  classes: PropTypes.object.isRequired,
}


const mapStateToProps = (state) => ({
  motioning: state.streaming.motioning
})

const mapDispatchToProps = (dispatch) => ({
})


export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MotionIndicator)
)
