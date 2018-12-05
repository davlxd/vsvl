import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Tooltip from '@material-ui/core/Tooltip'

import { withStyles } from '@material-ui/core/styles'

import DirectionsRunIcon from '@material-ui/icons/DirectionsRun'
import SavingIcon from '@material-ui/icons/SaveAlt'
import EncodingIcon from '@material-ui/icons/VideoLibraryOutlined'
// import EncodingIcon from '@material-ui/icons/VideoLibrary'


const styles = theme => ({
  root: {
    position: 'fixed',
    right: theme.spacing.unit * 1,
    bottom: theme.spacing.unit * 10,
    zIndex: 2,
    animation: 'flash linear 2s infinite',
    display: 'flex',
    flexDirection: 'column'
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
    const { classes, motioning, saving, encoding } = this.props

    return (
      <div className={classes.root}>
        <Tooltip title="Motion detected">
          <DirectionsRunIcon className={classes.motionIcon} style={{visibility: motioning ? 'visible' : 'hidden'}} color="action" fontSize="large"/>
        </Tooltip>

        <Tooltip title="Saving captured video">
          <SavingIcon className={classes.savingIcon} style={{visibility: saving ? 'visible' : 'hidden'}} color="action" fontSize="large"/>
        </Tooltip>

        <Tooltip title="Preparing video file">
          <EncodingIcon className={classes.encodingIcon} style={{visibility: encoding ? 'visible' : 'hidden'}} color="action" fontSize="large"/>
        </Tooltip>
      </div>

    )
  }
}

MotionIndicator.propTypes = {
  classes: PropTypes.object.isRequired,
}


const mapStateToProps = (state) => ({
  ...state.streaming
})

const mapDispatchToProps = (dispatch) => ({
})


export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MotionIndicator)
)
