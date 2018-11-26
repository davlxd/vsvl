import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
});

class NeedCameraSnack extends Component {
  componentDidMount() {
    this.setState({
      open: this.props.on
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.on !== prevProps.on) {
      this.setState({
        open: this.props.on
      })
    }
  }

  state = {
    open: false,
  }

  handleClick = () => {
    this.setState({ open: true })
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false })
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={10000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">We need Webcam access to work. To grant the access, click the icon to the left of the web address.</span>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={this.handleClose}>
              GOT IT
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    )
  }
}

NeedCameraSnack.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(NeedCameraSnack)
