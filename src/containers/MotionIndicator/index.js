import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Tooltip from '@material-ui/core/Tooltip'

import { withStyles } from '@material-ui/core/styles'

import DirectionsRunIcon from '@material-ui/icons/DirectionsRun'
import SavingIcon from '@material-ui/icons/SaveAlt'
import CircularProgress from '@material-ui/core/CircularProgress'


const styles = theme => ({
  root: {
    position: 'fixed',
    right: theme.spacing.unit * 1,
    bottom: theme.spacing.unit * 10,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column'
  },
  indicator: {
    animation: 'flash linear 2s infinite',
    display: 'flex',
    flexDirection: 'column'
  },
  progressList: {
    display: 'flex',
    marginTop: theme.spacing.unit * 1,
    flexDirection: 'column',
    alignItems: 'center',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  progress: {
    marginTop: theme.spacing.unit * 1,
    marginBottom: theme.spacing.unit * 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: theme.spacing.unit * 10,
  },
  motionIcon: {
    marginTop: theme.spacing.unit * 1,
  },
  savingIcon: {
    marginTop: theme.spacing.unit * 1,
  },
  encodingIcon: {
    marginTop: theme.spacing.unit * 1,
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
    const { classes, motioning, saving, progressList } = this.props
    return (
      <div className={classes.root}>
        <div className={classes.indicator}>
          <Tooltip title="Motion detected">
            <DirectionsRunIcon className={classes.motionIcon} style={{visibility: motioning ? 'visible' : 'hidden'}} color="action" fontSize="large"/>
          </Tooltip>

          <Tooltip title="Saving captured video">
            <SavingIcon className={classes.savingIcon} style={{visibility: saving ? 'visible' : 'hidden'}} color="action" fontSize="large"/>
          </Tooltip>
        </div>
        <div className={classes.progressList}>
          {progressList.map(({ id, percentage }) => (
            <Tooltip title={`Preparing video file ${Math.round(percentage * 100)}%`} key={id}>
              <CircularProgress className={classes.progress} variant="static" size={30} thickness={5} value={percentage * 100} color="inherit"/>
            </Tooltip>
          ))}
        </div>
      </div>

    )
  }
}

MotionIndicator.propTypes = {
  classes: PropTypes.object.isRequired,
}


const mapStateToProps = (state) => ({
  ...state.streaming,
  ...state.ffmpeg,
})

const mapDispatchToProps = (dispatch) => ({
})


export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MotionIndicator)
)
