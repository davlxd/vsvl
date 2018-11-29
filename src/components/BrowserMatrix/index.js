import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import marked from 'marked'

const styles = theme => ({
  root: {
    backgroundColor: '#f3f9fe',
    height: '100vh',
  },
  paper: {
    padding: theme.spacing.unit * 3,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '65vw',
    maxWidth: '650px',
  },
})

class BrowserMatrix extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <section>
            <article>Comming soon</article>
          </section>
        </Paper>
      </div>
    )
  }
}


export default withStyles(styles)(BrowserMatrix)
