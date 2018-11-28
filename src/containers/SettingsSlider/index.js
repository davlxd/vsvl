import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Slide from '@material-ui/core/Slide'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Radio from '@material-ui/core/Radio'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'

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
    background: 'rgba(255,255,255,0.8)',
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
  filePrefixTextField: {
    marginBottom: theme.spacing.unit * 3,
  },
  ul: {
    marginTop: theme.spacing.unit * 0.5,
  },
  a: {
    color: 'inherit'
  },
})

class SettingsSlider extends React.Component {
  state = {
    checked: false,
  }

  handleSettingButtonClick = () => {
    this.setState(state => ({ checked: !state.checked }));
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  }

  render() {
    const { classes } = this.props
    const { checked } = this.state

    return (
      <div className={classes.root}>
        <IconButton key="settings" aria-label="ShowSettings" color="primary" className={classes.settingsIcon} onClick={this.handleSettingButtonClick}>
          <SettingsIcon />
        </IconButton>
        <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
          <Paper elevation={0} className={classes.bigPaper}>
            <Paper elevation={1} className={classes.paperSettingColumn}>
              <Typography variant="h5" gutterBottom> Live Feed </Typography>
              <Divider className={classes.dividerBelowTitle}/>
              <FormControlLabel control={ <Switch checked={true} onChange={this.handleChange('checkedA')} color="primary" /> } label="Alert when motion detected" />
              <FormControl component="fieldset" className={classes.formControl}>
                <RadioGroup aria-label="Alerting" name="alert-strategy" className={classes.radioGroup} value={this.state.value} onChange={this.handleChange}>
                  <FormControlLabel value="alert-once" control={<Radio />} label="Alert once" />
                  <FormControlLabel value="keep-alerting" control={<Radio />} label="Keep alerting" />
                </RadioGroup>
              </FormControl>
            </Paper>

            <Paper elevation={1} className={classes.paperSettingColumn}>
              <Typography variant="h5" gutterBottom>Saving to Files</Typography>
              <Divider className={classes.dividerBelowTitle}/>
              <FormControlLabel control={ <Switch checked={true} onChange={this.handleChange('checkedA')} color="primary" /> } label="Saving to files" />
              <TextField id="file-prefix" label="File prefix" className={classes.filePrefixTextField} value='videosurveillance.webcamp-clip-' fullWidth onChange={this.handleChange('name')} margin="normal" />
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Split files by</FormLabel>
                <RadioGroup aria-label="Alerting" name="alert-strategy" className={classes.radioGroup} value={this.state.value} onChange={this.handleChange}>
                  <FormControlLabel value="alert-once" control={<Radio />} label="Motion detected" />
                  <FormControlLabel value="keep-alerting" control={<Radio />} label="File size" />
                  <FormControlLabel value="keep-alerting" control={<Radio />} label="Interval" />
                </RadioGroup>
              </FormControl>
            </Paper>

            <Paper elevation={1} className={classes.paperSettingColumn}>
              <Typography variant="h5" gutterBottom>About</Typography>
              <Divider className={classes.dividerBelowTitle}/>
              <Typography variant="body1"> This Web application is made possible with the following awesome projects: </Typography>
              <ul className={classes.ul}>
                <li><Typography variant="body1"><a href='https://wordpress.com/' target='_blank' className={classes.a}>Wordpress</a></Typography></li>
                <li><Typography variant="body1"><a href='https://reactjs.org/' target='_blank' className={classes.a}>React</a></Typography></li>
                <li><Typography variant="body1"><a href='https://redux.js.org/' target='_blank' className={classes.a}>Redux</a></Typography></li>
                <li><Typography variant="body1"><a href='https://material-ui.com' target='_blank' className={classes.a}>Material UI</a></Typography></li>
                <li><Typography variant="body1"><a href='https://docs.opencv.org/3.4/index.html' target='_blank' className={classes.a}>OpenCV.js</a></Typography></li>
              </ul>
              <Typography variant="body1" gutterBottom>You can contact us for bugs, feedback, feature requests or something else through following channels: </Typography>
              <ul className={classes.ul}>
                <li><Typography variant="body1"><a href='mailto:contact@videosurveillance.webcam' className={classes.a}>Email</a></Typography></li>
              </ul>
              <Typography variant="caption" gutterBottom><a href='/terms-of-service' target='_blank' className={classes.a}>Terms of Service</a>, <a href='/privacy-policy' target='_blank' className={classes.a}>Privacy Policy</a>, and <a href='/cookie-policy' target='_blank' className={classes.a}>Cookie Policy</a></Typography>
            </Paper>
          </Paper>
        </Slide>
      </div>
    )
  }
}

SettingsSlider.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SettingsSlider)
