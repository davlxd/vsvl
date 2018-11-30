import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Tooltip from '@material-ui/core/Tooltip'

import { withStyles } from '@material-ui/core/styles'

import DirectionsRunIcon from '@material-ui/icons/DirectionsRun'


const styles = theme => ({
  motionIcon: {
    position: 'fixed',
    bottom: theme.spacing.unit * 10,
    right: theme.spacing.unit * 2,
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
      <Tooltip title="Motion detected">
        <DirectionsRunIcon className={classes.motionIcon} style={{display: motioning ? null : 'none'}} color="action" fontSize="large"/>
      </Tooltip>
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
