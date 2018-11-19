import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import marked from 'marked'

const styles = theme => ({
  root: {
    backgroundColor: '#f3f9fe',
  },
  paper: {
    padding: theme.spacing.unit * 3,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '65vw',
    maxWidth: '650px',
  },
})

class LegalDoc extends Component {
  constructor(props) {
    super(props)
    this.state = {markdown: ''}
  }

  componentWillMount() {
    const readmePath = require(`../../legal-doc${this.props.location.pathname}.md`);

    fetch(readmePath)
      .then(response => {
        return response.text()
      })
      .then(text => {
        this.setState({
          markdown: marked(text)
        })
      })
  }

  render() {
    const { classes } = this.props
    const { markdown } = this.state

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <section>
            <article dangerouslySetInnerHTML={{__html: markdown}}></article>
          </section>
        </Paper>
      </div>
    )
  }
}


export default withStyles(styles)(LegalDoc)
