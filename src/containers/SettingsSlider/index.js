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

import BrowserCannotSavingFilesSnack from '../../components/BrowserCannotSavingFilesSnack'
import EncodingCouldTakeLongTimeSnack from '../../components/EncodingCouldTakeLongTimeSnack'
import SavingExplainSnack from '../../components/SavingExplainSnack'

import browser from 'browser-detect'

import { ALTER_SETTING, RECOVER_SETTINGS_FROM_WEB_STORAGE, SETTINGS_SLIDER_ON, SETTINGS_SLIDER_OFF } from '../../actions'

const styles = theme => ({
  root: {
    width: '100vw',
    height: '100vh',
    overflowY: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIconButton: {
    background: 'rgba(255,255,255,0.2)',
    position: 'fixed',
    bottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: 2,
  },
  settingsIcon: {
    // background: 'rgba(255,255,255,0.2)',
  },
  bigPaper: {
    background: 'rgba(255,255,255,0.5)',
    zIndex: 1,
    width: '90%',
    maxWidth: theme.spacing.unit * 40 * 3 * 1.2,
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
    // marginBottom: theme.spacing.unit * 4,
  },
  savingRawVideoFilesCheckbox: {
    marginTop: theme.spacing.unit * 1,
    marginBottom: theme.spacing.unit * 2,
  },
  fileSplitSizeTextField: {
    width: theme.spacing.unit * 10,
  },
  splitFileTimeSelect: {
    marginBottom: theme.spacing.unit * 1,
  },
  createANewFileLabel: {
    marginBottom: theme.spacing.unit * 1,
  },
  aboutParagraph2: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  a: {
    color: 'inherit'
  },
})

class SettingsSlider extends Component {
  state = {
    checked: false,
    putOnBrowserCannotSavingFilesSnack: false,
    putOnSavingExplainSnack: false,
    putOnEncodingCouldTakeLongTimeSnack: false,
  }

  componentDidMount() {
    this.props.recoverSettingsFromWebStorage(JSON.parse(localStorage.getItem('settings')))
  }

  componentDidUpdate(prevProps) {
    if (this.props.consent && JSON.stringify(prevProps.settings) !== JSON.stringify(this.props.settings) ) {
      localStorage.setItem('settings', JSON.stringify(this.props.settings))
    }
  }

  handleSettingButtonClick = () => {
    if (this.state.checked) {
      this.props.settingsSliderOff()
    } else {
      this.props.settingsSliderOn()
    }
    this.setState(state => ({ checked: !this.state.checked }));
  }

  handleToggle = name => event => {
    this.props.alterSettings(name, event.target.checked)
  }

  handleToggleSavingToFiles = event => {
    if (browser().name === 'chrome' || browser().name === 'firefox' || browser().name === 'opera') {
      this.setState({ putOnSavingExplainSnack: true })
      return this.handleToggle('savingToFiles')(event)
    }

    this.setState({ putOnBrowserCannotSavingFilesSnack: true })
  }

  handleChange = name => event => {
    this.props.alterSettings(name, event.target.value)
  }


  handleSplitFileTimeChange = event => {
    const value = event.target.value
    if ((value === 'on-the-30-min' || value === 'on-the-hour') && !this.props.savingRawVideoFiles) {
      this.setState({
        putOnEncodingCouldTakeLongTimeSnack: true
      })
    }
    this.handleChange('splitFileTime')(event)
  }

  render() {
    const {
      classes,
      playbackDisplayMode,
      alertingOnMotion,
      alertingOnMotionStrategy,
      savingToFiles,
      savingRawVideoFiles,
      savingToFilesOnlyMotionDetected,
      savingToFilesStrategy,
      savingToFilesPrefix,
      splitFileSize,
      splitFileTime,
     } = this.props
    const { checked, putOnBrowserCannotSavingFilesSnack, putOnSavingExplainSnack, putOnEncodingCouldTakeLongTimeSnack } = this.state

    return (
      <div className={classes.root}>
        <IconButton key="settings" aria-label="ShowSettings" className={classes.settingsIconButton} onClick={this.handleSettingButtonClick}>
          <SettingsIcon color="action" fontSize="large" className={classes.settingsIcon}/>
        </IconButton>
        <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
          <Paper elevation={0} className={classes.bigPaper}>
            <Paper elevation={1} className={classes.paperSettingColumn}>
              <Typography variant="h5" gutterBottom> Playback </Typography>
              <Divider className={classes.dividerBelowTitle}/>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend" className={classes.createANewFileLabel}>Display mode</FormLabel>
                <RadioGroup aria-label="DisplayMode" name="playback-display-mode" className={classes.radioGroup} value={playbackDisplayMode} onChange={this.handleChange('playbackDisplayMode')}>
                  <FormControlLabel value="original" className={classes.radioLabel} control={<Radio color="primary"/>} label="Original" />
                  <FormControlLabel value="extend" className={classes.radioLabel}  control={<Radio color="primary"/>} label="Extend" />
                  <FormControlLabel value="fullscreen" className={classes.radioLabel}  control={<Radio color="primary"/>} label="Fullscreen" />
                </RadioGroup>
              </FormControl>
              <FormControlLabel control={ <Switch checked={alertingOnMotion} onChange={this.handleToggle('alertingOnMotion')} color="primary" /> } label="Alert when motion detected" />
              <FormControl component="fieldset" className={classes.formControl}>
                <RadioGroup aria-label="Alerting" name="alert-strategy" className={classes.radioGroup} value={alertingOnMotionStrategy} onChange={this.handleChange('alertingOnMotionStrategy')}>
                  <FormControlLabel value="alert-once" className={classes.radioLabel} control={<Radio color={alertingOnMotion ? 'primary' : 'default'}/>} label="Alert once" />
                  <FormControlLabel value="keep-alerting" className={classes.radioLabel} control={<Radio color={alertingOnMotion ? 'primary' : 'default'}/>} label="Keep alerting" />
                </RadioGroup>
              </FormControl>
            </Paper>

            <Paper elevation={1} className={classes.paperSettingColumn}>
              <Typography variant="h5" gutterBottom>Saving</Typography>
              <Divider className={classes.dividerBelowTitle}/>
              <FormControlLabel control={ <Switch checked={savingToFiles} onChange={this.handleToggleSavingToFiles} color="primary" /> } label='Save video clips' />
              <FormControlLabel control={ <Checkbox checked={savingToFilesOnlyMotionDetected} onChange={this.handleToggle('savingToFilesOnlyMotionDetected')} color={savingToFiles ? 'primary' : 'default'} /> } label="Pause saving when no motion detected" />
              <TextField id="file-prefix" label="File prefix" className={classes.filePrefixTextField} value={savingToFilesPrefix} fullWidth onChange={this.handleChange('savingToFilesPrefix')} margin="normal" color={savingToFiles ? 'primary' : 'default'}/>
              <FormControlLabel className={classes.savingRawVideoFilesCheckbox} control={ <Checkbox checked={savingRawVideoFiles} onChange={this.handleToggle('savingRawVideoFiles')} color={savingToFiles ? 'primary' : 'default'} /> } label={<span>Saving <a href='/faq' target='_blank' rel="noopener noreferrer" style={{color: 'inherit'}}>raw video files</a></span>}/>
              <FormControl component="fieldset" className={classes.formControl} color={savingToFiles ? 'primary' : 'default'}>
                <FormLabel component="legend" className={classes.createANewFileLabel}>Save to a new file</FormLabel>
                <RadioGroup aria-label="Alerting" name="alert-strategy" className={classes.radioGroup} value={savingToFilesStrategy} onChange={this.handleChange('savingToFilesStrategy')}>
                  <FormControlLabel value="motion-detected" className={classes.radioLabel} control={<Radio color={savingToFiles ? 'primary' : 'default'}/>} label="when motion detected" />
                  {/*<FormControlLabel value="file-size"className={classes.radioLabel}  control={<Radio color={savingToFiles ? 'primary' : 'default'}/>} label="the file size exceeds" /> */}
                  <FormControlLabel value="time" className={classes.radioLabel}  control={<Radio color={savingToFiles ? 'primary' : 'default'}/>} label="on specific time" />
                </RadioGroup>
              </FormControl>
              <TextField id="file-split-size" label="Size in MB" className={classes.fileSplitSizeTextField} style={{display: savingToFilesStrategy === 'file-size' ? null : 'none'}} value={splitFileSize} onChange={this.handleChange('splitFileSize')} margin="none" color={savingToFiles ? 'primary' : 'default'}/>
              <FormControl className={classes.splitFileTimeSelect} style={{display: savingToFilesStrategy === 'time' ? null : 'none'}}>
                <Select value={splitFileTime} onChange={this.handleSplitFileTimeChange} inputProps={{ name: 'split-file-name', id: 'split-file-name', }}>
                  <MenuItem value='on-the-1-min'>on the minute</MenuItem>
                  <MenuItem value='on-the-2-min'>on the 2 min</MenuItem>
                  <MenuItem value='on-the-5-min'>on the 5 min</MenuItem>
                  <MenuItem value='on-the-10-min'>on the 10 min</MenuItem>
                  <MenuItem value='on-the-30-min'>on the 30 min</MenuItem>
                  <MenuItem value='on-the-hour'>on the hour</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            <Paper elevation={1} className={classes.paperSettingColumn} style={{display: 'flex', flexDirection: 'column'}}>
              <Typography variant="h5" gutterBottom>About</Typography>
              <Divider className={classes.dividerBelowTitle}/>
              <Typography variant="body1">
                This Web application is made possible with many awesome projects: <a href='https://wordpress.com/' target='_blank' rel="noopener noreferrer" className={classes.a}>Wordpress</a>, <a href='https://nodejs.org/en/' target='_blank' rel="noopener noreferrer" className={classes.a}>Node</a>, <a href='https://reactjs.org/' target='_blank' rel="noopener noreferrer" className={classes.a}>React</a>, <a href='https://redux.js.org/' target='_blank' rel="noopener noreferrer" className={classes.a}>Redux</a>, <a href='https://material-ui.com' target='_blank' rel="noopener noreferrer" className={classes.a}>Material UI</a>, <a href='https://docs.opencv.org/3.4/index.html' target='_blank' rel="noopener noreferrer" className={classes.a}>OpenCV.js</a>, <a href='https://github.com/Kagami/ffmpeg.js' target='_blank' rel="noopener noreferrer" className={classes.a}>FFmpeg.js</a>, <a href='https://github.com/jimmywarting/StreamSaver.js' target='_blank' rel="noopener noreferrer" className={classes.a}>StreamSaver.js</a>, <a href='https://github.com/eligrey/FileSaver.js/' target='_blank' rel="noopener noreferrer" className={classes.a}>FileSaver.js</a> and so on.
              </Typography>
              <Typography variant="body1" gutterBottom style={{flexGrow: 1}} className={classes.aboutParagraph2}>You can contact us for bugs, feedback, feature requests or something else through <a href='mailto:contact@videosurveillance.webcam' className={classes.a}>Email</a> .</Typography>
              <Typography variant="caption" gutterBottom><a href='/terms-of-service' target='_blank' rel="noopener noreferrer" className={classes.a}>Terms of Service</a>, <a href='/privacy-policy' target='_blank' rel="noopener noreferrer" className={classes.a}>Privacy Policy</a>, and <a href='/cookie-policy' target='_blank' rel="noopener noreferrer" className={classes.a}>Cookie Policy</a></Typography>
            </Paper>
          </Paper>
        </Slide>
        <BrowserCannotSavingFilesSnack on={putOnBrowserCannotSavingFilesSnack} off={() => {this.setState({putOnBrowserCannotSavingFilesSnack: false})}}/>
        <SavingExplainSnack on={putOnSavingExplainSnack} off={() => {this.setState({putOnSavingExplainSnack: false})}}/>
        <EncodingCouldTakeLongTimeSnack on={putOnEncodingCouldTakeLongTimeSnack} off={() => {this.setState({putOnEncodingCouldTakeLongTimeSnack: false})}}/>
      </div>
    )
  }
}

SettingsSlider.propTypes = {
  classes: PropTypes.object.isRequired,
}


const mapStateToProps = (state) => ({
  consent: state.misc.consent,
  ...state.settings,
  settings: state.settings
})

const mapDispatchToProps = (dispatch) => ({
  alterSettings: (name, value) => {
    dispatch(ALTER_SETTING(name, value))
  },
  recoverSettingsFromWebStorage: value => {
    dispatch(RECOVER_SETTINGS_FROM_WEB_STORAGE(value))
  },
  settingsSliderOn: () => {
    dispatch(SETTINGS_SLIDER_ON)
  },
  settingsSliderOff: () => {
    dispatch(SETTINGS_SLIDER_OFF)
  }
})


export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SettingsSlider)
)
