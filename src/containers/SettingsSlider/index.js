import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Slide from '@material-ui/core/Slide'
import FormControl from '@material-ui/core/FormControl'
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
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
  },
  bigPaper: {
    zIndex: 1,
    width: '90%',
    padding: theme.spacing.unit,

    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  paperSettingColumn: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit * 2,
    maxWidth: theme.spacing.unit * 50,
  },
  svg: {
    width: 400,
    height: 100,
  },
  polygon: {
    fill: theme.palette.common.white,
    stroke: theme.palette.divider,
    strokeWidth: 1,
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
          <Paper elevation={1} className={classes.bigPaper}>
            <Paper elevation={1} className={classes.paperSettingColumn}>
              <Typography variant="h5" gutterBottom> Live Feed </Typography>
              <Divider />
              <FormControlLabel
                control={ <Switch checked={true} onChange={this.handleChange('checkedA')} color="primary" /> }
                label="Alert when motion detected"
              />
              <FormControl component="fieldset" className={classes.formControl}>
                <RadioGroup aria-label="Alerting" name="alert-strategy" className={classes.group} value={this.state.value} onChange={this.handleChange}>
                  <FormControlLabel value="alert-once" control={<Radio />} label="Alert once" />
                  <FormControlLabel value="keep-alerting" control={<Radio />} label="Keep alerting" />
                </RadioGroup>
              </FormControl>
            </Paper>

            <Paper elevation={1} className={classes.paperSettingColumn}>
              <svg className={classes.svg}>
                <polygon points="0,100 50,00, 100,100" className={classes.polygon} />
              </svg>
            </Paper>

            <Paper elevation={1} className={classes.paperSettingColumn}>
              <Typography variant="h5" gutterBottom> About </Typography>
              <Divider />
              <Typography variant="body1" gutterBottom>
                asdffasdfasdf asdf
              </Typography>
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
