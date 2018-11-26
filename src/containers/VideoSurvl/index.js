import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import { APPLY_VIDEO_PARAMS_AS_SETTINGS, MOTION_DETECTED, MOTION_GONE } from '../../actions'
import NeedCameraSnack from '../../components/NeedCameraSnack'

const moment = require('moment')

const { createWriteStream, supported, version } = window.streamSaver


const styles = theme => ({
  bgvFullScreen: {
    position: 'fixed',
    minWidth: '100%',
    minHeight: '100%',
    top: '50%',
    left: '50%',
    zIndex: '-100',
    transform: 'translateX(-50%) translateY(-50%)',
  },
  bgvExtend: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: '-100',
    transform: 'translateX(-50%) translateY(-50%)',
  },
  bgvOriginal: {
    position: 'fixed',
    // minWidth: '100%',
    // minHeight: '100%',
    top: '50%',
    left: '50%',
    zIndex: '-100',
    transform: 'translateX(-50%) translateY(-50%)',
  }
})


class VideoSurvl extends Component {
  constructor(props) {
    super(props)

    this.videoRef = React.createRef()
    this.canvasRef = React.createRef()

    this.delayMotionGoneTimeoutHandle = null
    this.motionDetectCount = 0
    this.frame = null
    this.fgmask = null
    this.fgbg = null

    this.state = {
      putOnNeedCameraSnack: false,
      abort: false, //TEMP
    }
  }

  initiateCamera() {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      // video: { facingMode: 'environment', frameRate: 3}
      video: { facingMode: 'environment', }
    }).then(stream => {
      this.videoRef.current.srcObject = stream
      const { frameRate, height, width } = stream.getVideoTracks()[0].getSettings()
      const frameRatio = width / height
      this.props.applyVideoParamsAsSettings({
        frameRate,
        frameRatio,
        height,
        width
      })

      this.opencvProcessing()

    }).catch(err => {
      this.setState({
        putOnNeedCameraSnack: true
      })
      console.error(err)
    })
  }


  motionDetecting() {
    const cv = window.cv
    const MOTION_THRESHOLD = 5000
    const MOTION_GONE_DELAY = 4000
    const MOTION_DETECT_EVERY_N_FRAME = 3

    const motionDetectedNow = () => {
      if (!this.props.motioning) {
        this.props.motionDetected()
      }
      if (this.delayMotionGoneTimeoutHandle != null) {
        clearTimeout(this.delayMotionGoneTimeoutHandle)
        this.delayMotionGoneTimeoutHandle = null
      }
    }

    const motionNotDetectedNow = () => {
      if (!this.props.motioning) {
        return
      }
      if (this.delayMotionGoneTimeoutHandle == null) {
        this.delayMotionGoneTimeoutHandle = setTimeout(() => {
          this.delayMotionGoneTimeoutHandle = null
          if (this.props.motioning) {
            this.props.motionGone()
          }
        }, MOTION_GONE_DELAY)
      }
    }

    this.motionDetectCount = this.motionDetectCount >= 100 ? 0 : this.motionDetectCount + 1
    if (this.motionDetectCount % 3 !== 0) {
      return
    }

    this.fgbg.apply(this.frame, this.fgmask)
    cv.imshow('canvasOutputMotion', this.fgmask)
    console.log(cv.countNonZero(this.fgmask)) // TODO with a threshold then problem solved

    if (cv.countNonZero(this.fgmask) > MOTION_THRESHOLD) {
      motionDetectedNow()
    } else {
      motionNotDetectedNow()
    }
  }

  opencvProcessing() {
    const { width, height, frameRate } = this.props
    const cv = window.cv

    const cap = new cv.VideoCapture(this.videoRef.current)
    this.frame = new cv.Mat(height, width, cv.CV_8UC4)
    this.fgmask = new cv.Mat(height, width, cv.CV_8UC1)
    this.fgbg = new cv.BackgroundSubtractorMOG2(500, 16, false)

    const FPS = frameRate
    const processVideo = () => {
      try {
        let begin = Date.now()  // start processing
        cap.read(this.frame)

        this.motionDetecting()

        cv.putText(this.frame, moment().format('L LTS'), {x: 10, y: 20}, cv.FONT_HERSHEY_PLAIN , 1.3, [255, 255, 255, 255])
        cv.imshow('canvasOutput', this.frame)
        // this.writer.write(fgmask.data)

        // schedule the next one.
        let delay = 1000/FPS - (Date.now() - begin)

        if (!this.props.abort) {
          setTimeout(processVideo, delay)
        }

      } catch (err) {
        console.error(err)
      }
    }

    setTimeout(processVideo, 0);
  }

  componentDidMount() {
    this.initiateCamera()
  }

  componentWillUnmount() {
    if (this.frame != null) {
      this.frame.delete()
      this.frame = null
    }
    if (this.fgmask != null) {
      this.fgmask.delete()
      this.fgmask = null
    }
    if (this.fgbg != null) {
      this.fgbg.delete()
      this.fgbg = null
    }
  }

  render() {
    const { classes, playBackStyle, frameRatio, width, height } = this.props
    const { putOnNeedCameraSnack } = this.state
    return (
      <div>
        <video style={{display: 'none'}} width={width} height={height} className={classes.bgvOriginal} ref={this.videoRef} loop autoPlay></video>
        <canvas style={{[playBackStyle === 'extend' && frameRatio > 1 ? 'width' : 'height']: '100%'}} id='canvasOutput' ref={this.canvasRef} width={width} height={height}></canvas>
        <NeedCameraSnack on={putOnNeedCameraSnack}/>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  ...state.settings,
  ...state.streaming
})

const mapDispatchToProps = (dispatch) => ({
  applyVideoParamsAsSettings: obj => {
    dispatch(APPLY_VIDEO_PARAMS_AS_SETTINGS(obj))
  },
  motionDetected: () => {
    dispatch(MOTION_DETECTED)
  },
  motionGone: () => {
    dispatch(MOTION_GONE)
  }
})

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VideoSurvl)
)
