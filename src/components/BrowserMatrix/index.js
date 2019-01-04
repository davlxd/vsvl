import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows'
import AndroidIcon from '@material-ui/icons/Android'
import IOSIcon from '@material-ui/icons/PhoneIphone'

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
  desktopOrMobile: {
    display: 'flex',
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
    marginBottom: theme.spacing.unit * 8,
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
    const { classes, sorry } = this.props

    const desktopRows = [
      { browserName: 'chrome', playback: true, motionDetect: true, saveToFiles: true, },
      { browserName: 'opera', playback: true, motionDetect: true, saveToFiles: true, },
      { browserName: 'firefox', playback: true, motionDetect: true, saveToFiles: true, },
      { browserName: 'edge', playback: true, motionDetect: true, saveToFiles: false, },
      { browserName: 'safari', playback: true, motionDetect: true, saveToFiles: false, },
      { browserName: 'ie', playback: false, motionDetect: false, saveToFiles: false, },
    ]
    const androidRows = [
      { browserName: 'chrome', playback: true, motionDetect: true, saveToFiles: true, },
      { browserName: 'opera', playback: true, motionDetect: true, saveToFiles: true, },
      { browserName: 'firefox', playback: true, motionDetect: true, saveToFiles: true, },
    ]
    const iOSRows = [
      { browserName: 'safari', playback: true, motionDetect: true, saveToFiles: false, },
      { browserName: 'chrome', playback: false, motionDetect: false, saveToFiles: false, },
      { browserName: 'opera', playback: false, motionDetect: false, saveToFiles: false, },
      { browserName: 'firefox', playback: false, motionDetect: false, saveToFiles: false, },
    ]

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          { sorry  &&
            <section className={classes.section}>
              <Typography variant="h6">
                Sorry ... Your browser is not suspported ...
              </Typography>
            </section>
          }
          <section className={classes.section}>
            <div className={classes.desktopOrMobile}>
              <DesktopWindowsIcon />
              <span style={{marginLeft: 8}}>Desktop</span>
            </div>
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
                {desktopRows.map(row => {
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

          <section className={classes.section}>
            <div className={classes.desktopOrMobile}>
              <AndroidIcon />
              <span style={{marginLeft: 8}}>Android</span>
            </div>
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
                {androidRows.map(row => {
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

          <section className={classes.section}>
            <div className={classes.desktopOrMobile}>
              <IOSIcon />
              <span style={{marginLeft: 8}}>iOS</span>
            </div>
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
                {iOSRows.map(row => {
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

          <div style={{textAlign: 'center'}}> <a href='/faq' target='_blank' rel="noopener noreferrer" style={{color: 'inherit'}}>FAQ</a></div>
        </Paper>
      </div>
    )
  }
}

BrowserMatrix.propTypes = {
  sorry: PropTypes.bool.isRequired,
}

BrowserMatrix.defaultProps = {sorry: false}


export default withStyles(styles)(BrowserMatrix)
