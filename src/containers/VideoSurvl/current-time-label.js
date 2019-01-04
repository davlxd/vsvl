import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const moment = require('moment')

const styles = theme => ({
  text: {
    position: 'fixed',
    color: '#FFFFFF',
    fontFamily: '"Courier New", Courier, monospace',
  },
})

class CurrentTimeLabel extends Component {
  constructor(props) {
    super(props)
    this.intervalHandle = null
    this.state = {
      timeInText: moment().format('YYYY-MM-DD HH:mm:ss') ,
    }
  }
  componentDidMount() {
    this.intervalHandle = setInterval(() => {
      this.setState({
        timeInText: moment().format('YYYY-MM-DD HH:mm:ss')
      })
    }, 1000)
  }

  componentWillUnmount() {
    if (this.intervalHandle != null) {
      clearInterval(this.intervalHandle)
      this.intervalHandle = null
    }
  }

  render() {
    const { classes, style } = this.props
    const { timeInText } = this.state
    return (
      <span style={style} className={classes.text}>{ timeInText }</span>
    )
  }
}

CurrentTimeLabel.propTypes = {
  classes: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
}

export default withStyles(styles)(CurrentTimeLabel)
