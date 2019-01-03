import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import YesIcon from '@material-ui/icons/Done'
import NoIcon from '@material-ui/icons/Clear'

const styles = theme => ({
  root: {
    backgroundColor: '#f3f9fe',
    width: '100vw',
    // height: '100vh',
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing.unit * 3,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '80vw',
    maxWidth: '650px',
    overflowX: 'auto',
  },
  section: {
    marginTop: theme.spacing.unit * 2,
  },
  cell: {
    textAlign: 'center',
    paddingRight: theme.spacing.unit * 0.1,
  }
})

class BrowserMatrix extends Component {
  componentWillMount() {
  }

  render() {
    const { classes } = this.props

    const rows = [
      { browserName: 'chrome', playback: true, motionDetect: true, saveToFiles: true, },
      { browserName: 'opera', playback: true, motionDetect: true, saveToFiles: true, },
      { browserName: 'firefox', playback: true, motionDetect: true, saveToFiles: true, },
      { browserName: 'edge', playback: true, motionDetect: true, saveToFiles: false, },
      { browserName: 'safari', playback: false, motionDetect: false, saveToFiles: false, },
      { browserName: 'ie', playback: false, motionDetect: false, saveToFiles: false, },
    ]

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <section>
            <Typography variant="h6">
              Sorry ... Your browser is not suspported ...
             </Typography>
          </section>
          <section className={classes.section}>
            <Typography variant="subtitle1">
              It may sound unworthy but this Web application is compatible with most modern browsers, except for Safari (that also include every browser on iOS. Yes, they are all Safari at their core).
             </Typography>
          </section>
          <br />
          <section>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.cell}></TableCell>
                  <TableCell className={classes.cell}>Playback</TableCell>
                  <TableCell className={classes.cell}>Motion detect</TableCell>
                  <TableCell className={classes.cell}>Saving to files</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => {
                  return (
                    <TableRow key={row.browserName}>
                      <TableCell component="th" scope="row"  className={classes.cell}>
                        <img className={classes.img} width='40px' src={`/browser-logo-${row.browserName}.png`} alt={row.browserName}/>
                      </TableCell>
                      <TableCell className={classes.cell}>{row.playback ? <YesIcon /> : <NoIcon />}</TableCell>
                      <TableCell className={classes.cell}>{row.motionDetect ? <YesIcon /> : <NoIcon />}</TableCell>
                      <TableCell className={classes.cell}>{row.saveToFiles ? <YesIcon /> : <NoIcon />}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </section>
        </Paper>
      </div>
    )
  }
}


export default withStyles(styles)(BrowserMatrix)
