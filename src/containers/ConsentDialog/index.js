import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import withMobileDialog from '@material-ui/core/withMobileDialog'
import Divider from '@material-ui/core/Divider'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import { USER_CLICK_CONSENT, } from '../../actions'


const styles = theme => ({
  dialogParagraph2: {
    marginTop: theme.spacing.unit * 1,
  },
  dialogParagraph22: {
    marginTop: theme.spacing.unit * 1,
    marginBottom: theme.spacing.unit * 1,
  },
  a: {
    color: 'inherit'
  }
})


class ConsentDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      complyLegalActivitiesChecked: false,
      consentToLegalDocsCheck: false,
    }
  }

  handleCheck = name => event => {
    this.setState({ [name]: event.target.checked });
  }

  handleProceed = () => {
    const { userClickConsent } = this.props

    userClickConsent()
    localStorage.setItem('consent', true)
  }

  componentDidMount() {
  }

  render() {
    const { classes, fullScreen, consent } = this.props
    const { complyLegalActivitiesChecked, consentToLegalDocsCheck } = this.state
    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={consent === false}
          onClose={null}
          aria-labelledby="videoSurveillance-webcam"
        >
          <DialogTitle id="videoSurveillance-webcam">{"Video Surveillance with Webcam"}</DialogTitle>
          <DialogContent>
            <DialogContentText variant='body1' className={classes.dialogParagraph1}>
              This Web application captures video from Webcam, presents on web page with motion detect alert,
              and can save video clips to your device.
            </DialogContentText>
            <DialogContentText variant='body1' className={classes.dialogParagraph2}>
              Video surveillance activities may or may not legal,
              depending on various scenarios and the country/region you live.
              Please seek legal advice and make sure your activities comply with all applicable laws and regulations.
              This Web application will not be held accountable for any illegal activities.
              Please respect the privacy of others!
            </DialogContentText>
            <FormControlLabel
              control={
                <Checkbox
                  id="checkbox-comply-legal-activities"
                  checked={complyLegalActivitiesChecked}
                  onChange={this.handleCheck('complyLegalActivitiesChecked')}
                  color="primary"
                />
              }
              label="I understand and agree."
            />
            <Divider />
            <br />
            <DialogContentText variant='body1' className={classes.dialogParagraph1}>
              This Web application is designed to run locally and will not upload captured videos/audios to the Internet.
              However it uses Google Analytics (to measure traffic and usage), which transfers data over Internet.
            </DialogContentText>
            <DialogContentText variant='body1' className={classes.dialogParagraph22}>
              This Web application also store cookies and Web storage on your device.
              Please read our <a href='/terms-of-service' target='_blank' rel="noopener noreferrer" className={classes.a}>Terms of Service</a>,
              <a href='/privacy-policy' target='_blank' rel="noopener noreferrer" className={classes.a}>Privacy Policy</a> and <a href='/cookie-policy' target='_blank' className={classes.a}>Cookies Policy</a> for detailed explanation.
            </DialogContentText>
            <FormControlLabel
              control={
                <Checkbox
                  id="checkbox-consent-to-legal-docs"
                  checked={consentToLegalDocsCheck}
                  onChange={this.handleCheck('consentToLegalDocsCheck')}
                  color="primary"
                />
              }
              label={<span>I consent cookies placement, have read and accept <a href='/terms-of-service' target='_blank' rel="noopener noreferrer" className={classes.a}>Terms of Service</a>
              , <a href='/privacy-policy' target='_blank' rel="noopener noreferrer" className={classes.a}>Privacy Policy</a> and <a href='/cookie-policy' target='_blank' className={classes.a}>Cookies Policy</a>.</span>}
            />
          </DialogContent>
          <DialogActions>
            <Button id="proceed-button" variant="outlined" onClick={this.handleProceed} color="primary" disabled={!(complyLegalActivitiesChecked && consentToLegalDocsCheck)} autoFocus>
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

ConsentDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  consent: state.misc.consent
})

const mapDispatchToProps = (dispatch) => ({
  userClickConsent: () => {
    dispatch(USER_CLICK_CONSENT)
  }
})

export let StyledConsentDialog = withStyles(styles)(ConsentDialog)

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withMobileDialog()(ConsentDialog))
)
