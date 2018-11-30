import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import { APPLY_VIDEO_PARAMS_AS_SETTINGS, MOTION_DETECTED, MOTION_GONE } from '../../actions'
import NeedCameraSnack from '../../components/NeedCameraSnack'
import SlowLoadingSnack from '../../components/SlowLoadingSnack'

import onAndDelayOff from './on-and-delay-off'
const moment = require('moment')

const { createWriteStream, } = window.streamSaver


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
  bgvExtendHorizontal: {
    position: 'fixed',
    width: '100%',
    top: '50%',
    left: '50%',
    zIndex: '-100',
    transform: 'translateX(-50%) translateY(-50%)',
  },
  bgvExtendVertical: {
    position: 'fixed',
    height: '100%',
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

    this.currentTimeIntervalHandle = null

    this.delayMotionGoneTimeoutHandle = null
    this.motionDetectCount = 0
    this.frame = null
    this.fgmask = null
    this.fgbg = null
    this.slowLoadingSnackTimeoutHandle = null

    this.savingToFileOnGoing = false
    this.savingToFileMediaRecorder = null
    this.savingToFileChunks = null
    this.savingToFileFileStreamWriter = null

    this.state = {
      putOnNeedCameraSnack: false,
      putOnSlowLoadingSnack: false,
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

      this.cancelScheduledSlowLoadingSnack()
      this.delayOpenCVProcessing()
      this.savingCanvasToFile()

    }).catch(err => {
      this.cancelScheduledSlowLoadingSnack()
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

    const { on: motionDetectedNow , off: motionNotDetectedNow } = onAndDelayOff(
      () => !this.props.motioning,  // funcOnPreq
      () => this.props.motionDetected(),  // funcOn
      () => this.props.motioning,  // funcOffPreq
      () => this.props.motionGone(),  // funcOff
      handleValue => this.delayMotionGoneTimeoutHandle = handleValue,  // delayOffTimeoutHandleSetter
      () => this.delayMotionGoneTimeoutHandle,  // delayOffTimeoutHandleGetter
      MOTION_GONE_DELAY,  // DELAY_IN_MS
    )

    this.motionDetectCount = this.motionDetectCount >= 100 ? 0 : this.motionDetectCount + 1
    if (this.motionDetectCount % MOTION_DETECT_EVERY_N_FRAME !== 0) {
      return
    }

    this.fgbg.apply(this.frame, this.fgmask)
    // cv.imshow('canvasOutputMotion', this.fgmask)
    // console.log(cv.countNonZero(this.fgmask))

    if (cv.countNonZero(this.fgmask) > MOTION_THRESHOLD) {
      motionDetectedNow()
    } else {
      motionNotDetectedNow()
    }
  }

  delayOpenCVProcessing(delayInMS = 3000) {
    delayInMS = delayInMS + 1000
    if (typeof window.cv !== 'undefined') {
      return this.openCVProcessing()
    }
    this.setState({ putOnSlowLoadingSnack: true })
    setTimeout(() => {
      this.delayOpenCVProcessing(delayInMS / 2)
    }, delayInMS)
  }

  cancelScheduledSlowLoadingSnack() {
    if (this.slowLoadingSnackTimeoutHandle != null) {
      clearTimeout(this.slowLoadingSnackTimeoutHandle)
      this.slowLoadingSnackTimeoutHandle = null
    }
  }

  openCVProcessing() {
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

  closeCurrentFile(recreate=true) {
    console.log('!!!!!   Closing up')
    if (this.savingToFileMediaRecorder == null && !this.savingToFileOnGoing) {
      return
    }
    this.savingToFileMediaRecorder.stop()
    setTimeout(
      () => {
        this.savingToFileChunks.then(evt => {
          this.savingToFileFileStreamWriter.close()
          this.savingToFileOnGoing = false
          this.savingToFileMediaRecorder = null
          if (recreate){
            this.savingCanvasToFile()
          }
        })
      }, 1000)
  }

  savingCanvasToFile() {
    const { savingToFiles, frameRate, savingToFilesPrefix, } = this.props
    if (!savingToFiles) {
      return
    }
    if (this.savingToFileOnGoing) {
      return
    }
    this.savingToFileOnGoing = true
    console.log('!!!!!Kicking off a savingCanvasToFile')

    const mediaStream = this.canvasRef.current.captureStream(frameRate)
    this.savingToFileMediaRecorder = new MediaRecorder(mediaStream)
    this.savingToFileChunks = Promise.resolve()
    const fileReader = new FileReader()

    const fileStream = createWriteStream(`${savingToFilesPrefix}_${Date.now()}_${moment().format('YYYY-DD-MM_HH-mm-ss')}.mp4`)
    this.savingToFileFileStreamWriter = fileStream.getWriter()

    this.savingToFileMediaRecorder.start()

    // setTimeout(() => {
    //   this.savingToFileMediaRecorder.pause()
    // }, 2000)

    // setTimeout(() => {
    //   this.closeCurrentFile(false)
    // }, 40000)


    this.savingToFileMediaRecorder.onstart = () => {
      console.log('---------------------onstart')
    }
    this.savingToFileMediaRecorder.onstop = () => {
      console.log('---------------------onstop')
    }
    this.savingToFileMediaRecorder.onpause = () => {
      console.log('---------------------onpause')
    }
    this.savingToFileMediaRecorder.onresume = () => {
      console.log('---------------------onresume')
    }
    this.savingToFileMediaRecorder.ondataavailable = ({ data }) => {
      console.log('---------------------ondataavailable')
      this.savingToFileChunks = this.savingToFileChunks.then(() => new Promise(resolve => {
        fileReader.onload = () => {
          this.savingToFileFileStreamWriter.write(new Uint8Array(fileReader.result))
          resolve()
        }
        fileReader.readAsArrayBuffer(data)
      }))
    }

  }

  componentDidMount() {
    this.initiateCamera()
    this.currentTimeIntervalHandle = setInterval(() => this.splitFileBasedOnTime(), 1000)

    this.slowLoadingSnackTimeoutHandle = setTimeout(() => {
      this.setState({
        putOnSlowLoadingSnack: true
      })
    }, 4000)
  }

  splitFileBasedOnTime() {
    const s = Math.round(Date.now() / 1000)

    if (this.savingToFileOnGoing && this.props.savingToFilesStrategy === 'time') {
      let m = 60
      switch (this.props.splitFileTime) {
        case 'on-the-1-min': m = 60 * 1; break;
        case 'on-the-2-min': m = 60 * 2; break;
        case 'on-the-5-min': m = 60 * 5; break;
        case 'on-the-10-min': m = 60 * 10; break;
        case 'on-the-30-min': m = 60 * 30; break;
        case 'on-the-hour': m = 60 * 60; break;
        default: m = 60
      }

      if (s % m === 0) {
        this.closeCurrentFile(true)
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      savingToFiles,
      savingToFilesOnlyMotionDetected,
      savingToFilesStrategy,
      motioning,
    } = this.props

    const motionDetected = !prevProps.motioning && motioning
    const motionGone = prevProps.motioning && !motioning

    if (!prevProps.savingToFiles && savingToFiles) { // kick off a saving when user switch on
      this.savingCanvasToFile()
    }

    if (prevProps.savingToFiles && !savingToFiles) {
      this.closeCurrentFile(false)
    }

    if (this.savingToFileOnGoing && this.savingToFileMediaRecorder != null && savingToFilesOnlyMotionDetected && motionGone) {
      this.savingToFileMediaRecorder.pause()
    }

    if (this.savingToFileOnGoing && this.savingToFileMediaRecorder != null && savingToFilesOnlyMotionDetected && motionDetected) {
      this.savingToFileMediaRecorder.resume()
    }

    if (this.savingToFileOnGoing && savingToFilesStrategy === 'motion-detected' && motionGone) {
      this.closeCurrentFile(false)
    }

    if (!this.savingToFileOnGoing && savingToFiles && savingToFilesStrategy === 'motion-detected' && motionDetected) {
      this.savingCanvasToFile()
    }
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
    if (this.currentTimeIntervalHandle != null) {
      clearInterval(this.currentTimeIntervalHandle)
      this.currentTimeIntervalHandle = null
    }
  }

  render() {
    const { classes, playbackDisplayMode, frameRatio, width, height } = this.props
    const { putOnNeedCameraSnack, putOnSlowLoadingSnack } = this.state

    let streamingStyleClass = classes.bgvFullScreen
    if (playbackDisplayMode === 'original') {
      streamingStyleClass = classes.bgvOriginal
    }
    if (playbackDisplayMode === 'extend') {
      streamingStyleClass = frameRatio > 1 ? classes.bgvExtendVertical : classes.bgvExtendHorizontal
    }
    return (
      <div>
        <video style={{display: 'none'}} width={width} height={height} className={classes.bgvOriginal} ref={this.videoRef} loop autoPlay></video>
        <canvas id='canvasOutput' ref={this.canvasRef} className={streamingStyleClass} width={width} height={height}></canvas>
        {/* <canvas style={{[playbackDisplayMode === 'extend' && frameRatio > 1 ? 'width' : 'height']: '100%'}} id='canvasOutputMotion' className={classes.bgvOriginal} width={width} height={height}></canvas> */}
        <NeedCameraSnack on={putOnNeedCameraSnack} off={() => { this.setState({putOnNeedCameraSnack: false}) }}/>
        <SlowLoadingSnack on={putOnSlowLoadingSnack} off={() => { this.setState({putOnSlowLoadingSnack: false}); this.slowLoadingSnackTimeoutHandle = null; }}/>
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
