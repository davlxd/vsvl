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
  dialogParagraph: {
    marginTop: theme.spacing.unit * 0.3,
    marginBottom: theme.spacing.unit * 0.3,
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
            <DialogContentText variant='body1' className={classes.dialogParagraph}>
              This Web application captures video from Webcam, presents on web page,
              and/or saves to files on your device, with various Video Content Analysis functionalities (e.g. motion detection) available.
            </DialogContentText>
            <DialogContentText variant='body1' className={classes.dialogParagraph}>
              Video surveillance activities may or may not legal,
              depending on various scenarios and the country/region you live.
              Please seek legal advice and make sure your activities comply with all applicable laws and regulations.
              This Web application will not be held accountable for any illegal activities.
            </DialogContentText>
            <FormControlLabel
              control={
                <Checkbox
                  checked={complyLegalActivitiesChecked}
                  onChange={this.handleCheck('complyLegalActivitiesChecked')}
                  color="primary"
                />
              }
              label="I agree and understand."
            />
            <Divider />
            <br />
            <DialogContentText variant='body1' className={classes.dialogParagraph}>
              This Web application is designed to run locally and will not upload captured videos/audios to the Internet.
              However this Web application uses Google Analytics (to measure traffic and usage), which transfers data over Internet.
            </DialogContentText>
            <DialogContentText variant='body1' className={classes.dialogParagraph}>
              This Web application also store cookies on your device.
              Please read our <a href='/terms-of-service' target='_blank' className={classes.a}>Terms of Service</a>,
              <a href='/privacy-policy' target='_blank' className={classes.a}>Privacy Policy]</a> and <a href='/cookie-policy' target='_blank' className={classes.a}>Cookies Policy</a> for detailed explanation.
            </DialogContentText>
            <FormControlLabel
              control={
                <Checkbox
                  checked={consentToLegalDocsCheck}
                  onChange={this.handleCheck('consentToLegalDocsCheck')}
                  color="primary"
                />
              }
              label="I consent cookies placement, have read and accept Terms of Service, Privacy Policy and Cookies Policy."
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={this.handleProceed} color="primary" disabled={!(complyLegalActivitiesChecked && consentToLegalDocsCheck)} autoFocus>
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
};

const mapStateToProps = (state) => ({
  consent: state.misc.consent
})

const mapDispatchToProps = (dispatch) => ({
  userClickConsent: () => {
    dispatch(USER_CLICK_CONSENT)
  }
})

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withMobileDialog()(ConsentDialog))
)
