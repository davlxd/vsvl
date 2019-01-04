import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import { APPLY_VIDEO_PARAMS_AS_SETTINGS, STREAM_READY, MOTION_DETECTED, MOTION_GONE, } from '../../actions'
import NeedCameraSnack from '../../components/NeedCameraSnack'
import SlowLoadingSnack from '../../components/SlowLoadingSnack'

import mobileAndTabletDetector from '../../browsers/mobileAndTabletDetector'

import SavingToFiles from '../SavingToFiles'

import ImmediateOnAndDelayOff from './immediate-on-and-delay-off'
const moment = require('moment')



const styles = theme => {
  const centerize = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: '-100',
    transform: 'translateX(-50%) translateY(-50%)',
  }
  const bgBase = centerize
  return {
    root: {
      userSelect: 'none',
    },
    bgVideoFullScreen: {
      ...bgBase,
      minWidth: '100%',
      minHeight: '100%',
      width: 'auto',
      height: 'auto',
    },
    bgVideoExtend: {
      ...bgBase,
      minWidth: '100%',
      minHeight: '100%',
    },
    bgCanvasFullScreen: {
      ...bgBase,
      minWidth: '100%',
      minHeight: '100%',
    },
    bgCanvasExtendHorizontal: {
      ...bgBase,
      width: '100%',
    },
    bgCanvasExtendVertical: {
      ...bgBase,
      height: '100%',
    },
    bgOriginal: {
      ...bgBase,
    // minWidth: '100%',
    // minHeight: '100%',
    },
    videoTagTimeText: {
      position: 'absolute',
      color: '#FFFFFF',
      fontFamily: '"Courier New", Courier, monospace',
    },
    circularProgress: {
      ...centerize,
      zIndex: 1,
    }
  }
}

const mobilePortrait = () => (mobileAndTabletDetector() && window.innerHeight > window.innerWidth)
const mobileLandscape = () => (mobileAndTabletDetector() && window.innerHeight < window.innerWidth)

class VideoSurvl extends Component {
  constructor(props) {
    super(props)
    this.videoRef = React.createRef()
    this.canvasRef = React.createRef()

    this.splitFileBasedOnTimeScheduleJob = null

    const MOTION_GONE_DELAY = 4000
    this.delayedMotionOff = new ImmediateOnAndDelayOff(
      () => !this.props.motioning,  // funcOnPreq
      () => this.props.motionDetected(),  // funcOn
      () => this.props.motioning,  // funcOffPreq
      () => this.props.motionGone(),  // funcOff
      MOTION_GONE_DELAY  // DELAY_IN_MS,
    )
    this.motionDetectCount = 0
    this.frame = null
    this.fgmask = null
    this.fgbg = null
    this.slowLoadingSnackTimeoutHandle = null

    this.state = {
      putOnNeedCameraSnack: false,
      putOnSlowLoadingSnack: false,
      putOnCircularProgress: true,
      abort: false, //TEMP
      videoTagTimeText: '',
      videoTagTimeTexTX: 0,
      videoTagTimeTexTY: 0,
    }
  }

  initiateCamera() {
    this.slowLoadingSnackTimeoutHandle = setTimeout(() => {
      this.setState({ putOnSlowLoadingSnack: true })
    }, 4000)

    navigator.mediaDevices.getUserMedia({
      audio: false,
      // video: { facingMode: 'environment', frameRate: 3}
      video: { facingMode: 'environment', }
    }).then(stream => {
      this.videoRef.current.srcObject = stream
      let { frameRate, height = 480, width = 640 } = stream.getVideoTracks()[0].getSettings() // safari gives height&width 0
      if (mobileAndTabletDetector()) {
        [ width, height ] = [width, height].sort((a, b) => (mobilePortrait() ? a - b : b - a))
      }
      const frameRatio = width / height

      this.props.applyVideoParamsAsSettings({
        frameRate,
        frameRatio,
        height,
        width,
      })

      this.cancelScheduledSlowLoadingSnack()
      this.delayOpenCVProcessing()
      this.props.streamReady()

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
    const MOTION_DETECT_EVERY_N_FRAME = 3

    this.motionDetectCount = this.motionDetectCount >= 100 ? 0 : this.motionDetectCount + 1
    if (this.motionDetectCount % MOTION_DETECT_EVERY_N_FRAME !== 0) {
      return
    }

    this.fgbg.apply(this.frame, this.fgmask)
    // cv.imshow('canvasOutputMotion', this.fgmask)
    // console.log(cv.countNonZero(this.fgmask))

    if (cv.countNonZero(this.fgmask) > MOTION_THRESHOLD) {
      this.delayedMotionOff.on()
    } else {
      this.delayedMotionOff.off()
    }
  }

  delayOpenCVProcessing(delayInMS = 3000) {
    delayInMS = delayInMS + 1000
    if (typeof window.cv !== 'undefined') {
      this.setState({ putOnSlowLoadingSnack: false, putOnCircularProgress: false })
      return this.openCVProcessing()
    }
    if (delayInMS === 4000) {
      this.setState({ putOnSlowLoadingSnack: true })
    }
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

        let { x: videoTagX, y: videoTagY } = this.videoRef.current.getBoundingClientRect()
        this.setState({
          videoTagTimeText: moment().format('L LTS'),
          videoTagTimeTexTX: (videoTagX < 0 ? 0 : videoTagX) + 8,
          videoTagTimeTexTY: videoTagY < 0 ? 0 : videoTagY,
        })

        // schedule the next one.
        let delay = 1000/FPS - (Date.now() - begin)
        setTimeout(processVideo, delay)
      } catch (err) {
        console.error(err)
      }
    }

    setTimeout(processVideo, 0);
  }

  componentDidMount() {
    this.initiateCamera()
    window.onresize = () => this.forceUpdate()
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
    const { classes, playbackDisplayMode, frameRatio, width, height } = this.props
    const { putOnNeedCameraSnack, putOnSlowLoadingSnack, putOnCircularProgress, videoTagTimeText, videoTagTimeTexTX, videoTagTimeTexTY } = this.state

    let streamingVideoStyleClass = classes.bgVideoFullScreen
    let streamingCanvasStyleClass = classes.bgCanvasFullScreen
    if (playbackDisplayMode === 'original') {
      streamingVideoStyleClass = classes.bgOriginal
      streamingCanvasStyleClass = classes.bgOriginal
    }
    if (playbackDisplayMode === 'extend') {
      const screenRatio = window.innerWidth / window.innerHeight
      streamingCanvasStyleClass = screenRatio > frameRatio ? classes.bgCanvasExtendVertical : classes.bgCanvasExtendHorizontal
      streamingVideoStyleClass = classes.bgVideoExtend
    }

    return (
      <div className={classes.root}>
        <video width={width} height={height} className={streamingVideoStyleClass} ref={this.videoRef} loop autoPlay> </video>
        <span style={{ top: videoTagTimeTexTX, left: videoTagTimeTexTX }} className={classes.videoTagTimeText}>{videoTagTimeText}</span>
        {/* <canvas style={{[playbackDisplayMode === 'extend' && frameRatio > 1 ? 'width' : 'height']: '100%'}} id='canvasOutputMotion' className={classes.bgvOriginal} width={width} height={height}></canvas> */}
        <canvas style={{display: 'none'}} id='canvasOutput' ref={this.canvasRef} className={streamingCanvasStyleClass} width={width} height={height}></canvas>
        <SavingToFiles canvasRef={this.canvasRef}/>
        <div className={classes.circularProgress} style={{display: putOnCircularProgress ? null : 'none'}}>
          <CircularProgress />
        </div>
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
  streamReady: () => {
    dispatch(STREAM_READY)
  },
  motionDetected: () => {
    dispatch(MOTION_DETECTED)
  },
  motionGone: () => {
    dispatch(MOTION_GONE)
  },
})

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VideoSurvl)
)
