import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Slide from '@material-ui/core/Slide'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Radio from '@material-ui/core/Radio'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'

import browser from 'browser-detect'

import BrowserCannotSavingFilesSnack from '../../components/BrowserCannotSavingFilesSnack'

import { ALTER_SETTING, RECOVER_SETTINGS_FROM_WEB_STORAGE, } from '../../actions'


const styles = theme => ({
  root: {
    width: '100vw',
    height: '100vh',
    overflowY: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    zIndex: 2,
  },
  bigPaper: {
    background: 'rgba(255,255,255,0.5)',
    zIndex: 1,
    width: '90%',
    maxHeight: '90%',
    overflow: 'auto',
    padding: theme.spacing.unit * 2,

    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  paperSettingColumn: {
    background: 'rgba(255,255,255,0.6)',
    margin: theme.spacing.unit,
    padding: theme.spacing.unit * 2,
    maxWidth: theme.spacing.unit * 40,
    minWidth: theme.spacing.unit * 40,
    // display: 'flex',
    // flexDirection: 'column',
  },
  dividerBelowTitle: {
    marginBottom: theme.spacing.unit,
  },
  radioGroup: {
    flexDirection: 'row',
  },
  radioLabel: {
    height: theme.spacing.unit * 5,
  },
  filePrefixTextField: {
    marginBottom: theme.spacing.unit * 4,
  },
  fileSplitSizeTextField: {
    width: theme.spacing.unit * 10,
  },
  createANewFileLabel: {
    marginBottom: theme.spacing.unit * 1,
  },
  ul: {
    marginTop: theme.spacing.unit * 0.3,
    marginBottom: theme.spacing.unit * 1.3,
  },
  a: {
    color: 'inherit'
  },
})

class SettingsSlider extends Component {
  state = {
    checked: false,
    putOnBrowserCannotSavingFilesSnack: false,
  }

  componentDidMount() {
    this.props.recoverSettingsFromWebStorage(JSON.parse(localStorage.getItem('settings')))
  }

  componentDidUpdate(prevProps) {
    localStorage.setItem('settings', JSON.stringify(this.props.settings))
  }

  handleSettingButtonClick = () => {
    this.setState(state => ({ checked: !state.checked }));
  }

  handleToggle = name => event => {
    this.props.alterSettings(name, event.target.checked)
  }

  handleToggleSavingToFiles = event => {
    const b = browser()
    if (b.name === 'chrome' && b.versionNumber > 52) {
      return this.handleToggle('savingToFiles')(event)
    }

    if (b.name === 'opera' && b.versionNumber > 39) {
      return this.handleToggle('savingToFiles')(event)
    }

    this.setState({
      putOnBrowserCannotSavingFilesSnack: true
    })
  }

  handleChange = name => event => {
    this.props.alterSettings(name, event.target.value)
  }

  render() {
    const {
      classes,
      alertingOnMotion,
      alertingOnMotionStrategy,
      savingToFiles,
      savingToFilesOnlyMotionDetected,
      savingToFilesStrategy,
      savingToFilesPrefix,
      splitFileSize,
      splitFileTime,
     } = this.props
    const { checked, putOnBrowserCannotSavingFilesSnack } = this.state

    return (
      <div className={classes.root}>
        <IconButton key="settings" aria-label="ShowSettings" className={classes.settingsIcon} onClick={this.handleSettingButtonClick}>
          <SettingsIcon />
        </IconButton>
        <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
          <Paper elevation={0} className={classes.bigPaper}>
            <Paper elevation={1} className={classes.paperSettingColumn}>
              <Typography variant="h5" gutterBottom> Live Feed </Typography>
              <Divider className={classes.dividerBelowTitle}/>
              <FormControlLabel control={ <Switch checked={alertingOnMotion} onChange={this.handleToggle('alertingOnMotion')} color="primary" /> } label="Alert when motion detected" />
              <FormControl component="fieldset" className={classes.formControl} disabled={!alertingOnMotion}>
                <RadioGroup aria-label="Alerting" name="alert-strategy" className={classes.radioGroup} value={alertingOnMotion? alertingOnMotionStrategy : null} onChange={this.handleChange('alertingOnMotionStrategy')}>
                  <FormControlLabel value="alert-once" className={classes.radioLabel} control={<Radio color="primary"/>} label="Alert once" />
                  <FormControlLabel value="keep-alerting" className={classes.radioLabel} control={<Radio color="primary"/>} label="Keep alerting" />
                </RadioGroup>
              </FormControl>
            </Paper>

            <Paper elevation={1} className={classes.paperSettingColumn}>
              <Typography variant="h5" gutterBottom>Saving to Files</Typography>
              <Divider className={classes.dividerBelowTitle}/>
              <FormControlLabel control={ <Switch checked={savingToFiles} onChange={this.handleToggleSavingToFiles} color="primary" /> } label="Saving to files" />
              <FormControlLabel disabled={!savingToFiles} control={ <Checkbox checked={savingToFiles ? savingToFilesOnlyMotionDetected : false} onChange={this.handleToggle('savingToFilesOnlyMotionDetected')} color="primary" /> } label="Saving only when motion detected" />
              <TextField id="file-prefix" label="File prefix" className={classes.filePrefixTextField} disabled={!savingToFiles} value={savingToFiles? savingToFilesPrefix: ''} fullWidth onChange={this.handleChange('savingToFilesPrefix')} margin="normal" />
              <FormControl component="fieldset" className={classes.formControl} disabled={!savingToFiles}>
                <FormLabel component="legend" className={classes.createANewFileLabel}>Create a new file when</FormLabel>
                <RadioGroup aria-label="Alerting" name="alert-strategy" className={classes.radioGroup} value={savingToFiles? savingToFilesStrategy: null} onChange={this.handleChange('savingToFilesStrategy')}>
                  <FormControlLabel value="motion-detected" className={classes.radioLabel} control={<Radio color="primary"/>} label="motion detected" />
                  <FormControlLabel value="file-size"className={classes.radioLabel}  control={<Radio color="primary"/>} label="the file size exceeds" />
                  <FormControlLabel value="time"className={classes.radioLabel}  control={<Radio color="primary"/>} label="based on time" />
                </RadioGroup>
              </FormControl>
              <TextField id="file-split-size" label="Size in MB" className={classes.fileSplitSizeTextField} style={{display: savingToFiles && savingToFilesStrategy === 'file-size' ? null : 'none'}} value={splitFileSize} onChange={this.handleChange('splitFileSize')} margin="none" />
              <FormControl className={classes.formControl} style={{display: savingToFiles && savingToFilesStrategy === 'time' ? null : 'none'}}>
                <Select value={splitFileTime} onChange={this.handleChange('splitFileTime')} inputProps={{ name: 'split-file-name', id: 'split-file-name', }}>
                  <MenuItem value='daily'>Daily</MenuItem>
                  <MenuItem value='every-4-hours'>Every 4 hours</MenuItem>
                  <MenuItem value='every-hour'>Every hour</MenuItem>
                  <MenuItem value='every-30-min'>Every 30 min</MenuItem>
                  <MenuItem value='every-10-min'>Every 10 min</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            <Paper elevation={1} className={classes.paperSettingColumn} style={{display: 'flex', flexDirection: 'column'}}>
              <Typography variant="h5" gutterBottom>About</Typography>
              <Divider className={classes.dividerBelowTitle}/>
              <Typography variant="body1"> This Web application is made possible with the following awesome projects: </Typography>
              <ul className={classes.ul}>
                <li><Typography variant="body1"><a href='https://wordpress.com/' target='_blank' className={classes.a}>Wordpress</a></Typography></li>
                <li><Typography variant="body1"><a href='https://reactjs.org/' target='_blank' className={classes.a}>React</a></Typography></li>
                <li><Typography variant="body1"><a href='https://redux.js.org/' target='_blank' className={classes.a}>Redux</a></Typography></li>
                <li><Typography variant="body1"><a href='https://material-ui.com' target='_blank' className={classes.a}>Material UI</a></Typography></li>
                <li><Typography variant="body1"><a href='https://docs.opencv.org/3.4/index.html' target='_blank' className={classes.a}>OpenCV.js</a></Typography></li>
                <li><Typography variant="body1"><a href='https://github.com/jimmywarting/StreamSaver.js' target='_blank' className={classes.a}>StreamSaver.js</a></Typography></li>
              </ul>
              <Typography variant="body1" gutterBottom>You can contact us for bugs, feedback, feature requests or something else through following channels: </Typography>
              <ul className={classes.ul} style={{flexGrow: 1}}>
                <li><Typography variant="body1"><a href='mailto:contact@videosurveillance.webcam' className={classes.a}>Email</a></Typography></li>
              </ul>
              <Typography variant="caption" gutterBottom><a href='/terms-of-service' target='_blank' className={classes.a}>Terms of Service</a>, <a href='/privacy-policy' target='_blank' className={classes.a}>Privacy Policy</a>, and <a href='/cookie-policy' target='_blank' className={classes.a}>Cookie Policy</a></Typography>
            </Paper>
          </Paper>
        </Slide>
        <BrowserCannotSavingFilesSnack on={putOnBrowserCannotSavingFilesSnack} off={() => {this.setState({putOnBrowserCannotSavingFilesSnack: false})}}/>
      </div>
    )
  }
}

SettingsSlider.propTypes = {
  classes: PropTypes.object.isRequired,
}


const mapStateToProps = (state) => ({
  ...state.settings,
  settings: state.settings
})

const mapDispatchToProps = (dispatch) => ({
  alterSettings: (name, value) => {
    dispatch(ALTER_SETTING(name, value))
  },
  recoverSettingsFromWebStorage: value => {
    dispatch(RECOVER_SETTINGS_FROM_WEB_STORAGE(value))
  }
})


export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SettingsSlider)
)
