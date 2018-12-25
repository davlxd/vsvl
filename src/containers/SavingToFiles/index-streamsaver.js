import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import saveAs from 'file-saver'

import { APPLY_VIDEO_PARAMS_AS_SETTINGS, MOTION_DETECTED, MOTION_GONE, SAVING_FILES, SAVING_COMPLETE, FFMPEG_STARTED_PROCESSING_FILE, FFMPEG_FINISHED_PROCESSING_FILE } from '../../actions'
import NeedCameraSnack from '../../components/NeedCameraSnack'
import SlowLoadingSnack from '../../components/SlowLoadingSnack'

import UseVlcSnack from '../UseVlcSnack'

import ffmpegWorker from './ffmpeg-worker'
const moment = require('moment')
const schedule = require('node-schedule')

const useStreamSaver = false

const { createWriteStream, } = window.streamSaver


const styles = theme => ({
})


class SavingToFiles extends Component {
  constructor(props) {
    super(props)
    this.videoRef = React.createRef()
    this.canvasRef = React.createRef()

    this.splitFileBasedOnTimeScheduleJob = null

    this.slowLoadingSnackTimeoutHandle = null

    this.savingToFileStatus = 'closed'
    this.savingToFileName = ''
    this.savingToFileMediaRecorder = null
    this.savingToFileChunks = null
    this.savingToFileFileStreamWriter = null

    this.fileSaverChunks = []

    this.ffmpegLoadingTS = 0
    this.ffmpegLoadedTS = Infinity

    this.state = {
      puOnUseVlcSnack: false,
      abort: false, //TEMP
    }
  }

  ffmpegLoadingTime() {
    return this.ffmpegLoadedTS - this.ffmpegLoadingTS
  }

  closeCurrentFile(recreate=true) {
    console.log('! Closing up the savingToFile')
    if (this.savingToFileStatus !== 'started') {
      return
    }
    this.savingToFileStatus = 'closing'
    this.savingToFileMediaRecorder.stop()

    if (useStreamSaver) {
      setTimeout(
        () => {
          this.savingToFileChunks.then(evt => {
            this.savingToFileFileStreamWriter.close()
            this.savingToFileMediaRecorder = null
            this.props.savingComplete()
            this.savingToFileStatus = 'closed'
            this.setState({
              puOnUseVlcSnack: true
            })
            if (recreate){
              this.kickOffSavingToFile()
            }
          })
        }, 1000)
    } else {
      setTimeout(
        () => {
          const savingToFileNameCopy = this.savingToFileName
          const fileSaverChunksCopy = this.fileSaverChunks.slice(0)
          if (this.ffmpegLoadingTime() < 4000 && !this.props.savingRawVideoFiles) {
            console.log('ffmpeg-worker is ready and not rawing, use it')
            ffmpegWorker(ts => this.ffmpegLoadingTS = ts, ts => this.ffmpegLoadedTS = ts, new Blob(fileSaverChunksCopy), savingToFileNameCopy, () => this.props.ffmpegStartedProcessingFile(), () => {if (!this.props.encoding) this.props.ffmpegStartedProcessingFile() }, () => this.props.ffmpegFinishedProcessingFile())
          } else {
            console.log('ffmpeg-worker is not ready, or rawing, dump directly')
            saveAs(new Blob(fileSaverChunksCopy, { 'type' : 'video/mp4' }), savingToFileNameCopy)
            this.setState({
              puOnUseVlcSnack: true
            })
            ffmpegWorker(ts => this.ffmpegLoadingTS = ts, ts => { this.ffmpegLoadedTS = ts; console.log('this.ffmpegLoadingTime(): ', this.ffmpegLoadingTime()) })
          }
          this.fileSaverChunks = []
          this.savingToFileMediaRecorder = null
          this.props.savingComplete()
          this.savingToFileStatus = 'closed'
          if (recreate){
            this.kickOffSavingToFile()
          }
        }, 1000)
    }
  }

  pauseSavingToFile () {
    if (this.savingToFileStatus !== 'started') {
      return
    }
    this.savingToFileMediaRecorder.pause()
  }

  resumeOrKickoffSavingToFile () {
    if ((this.savingToFileStatus === 'starting' || this.savingToFileStatus === 'started') && this.savingToFileMediaRecorder != null) {
      this.savingToFileMediaRecorder.resume()
    } else if (this.savingToFileStatus === 'closing'){
      setTimeout(() => this.kickOffSavingToFile(), 1000)
    } else if (this.savingToFileStatus === 'closed'){
      this.kickOffSavingToFile()
    }
  }

  kickOffSavingToFile() {
    const { savingToFiles, frameRate, savingToFilesPrefix, savingToFilesOnlyMotionDetected, motioning } = this.props
    if (!savingToFiles) {
      return
    }
    if (this.savingToFileStatus === 'starting' || this.savingToFileStatus === 'started') {
      return
    }
    if (savingToFilesOnlyMotionDetected && !motioning) {
      return
    }

    this.savingToFileStatus = 'starting'
    console.log('! Kicking off a savingToFile')

    const mediaStream = this.canvasRef.current.captureStream(frameRate)
    this.savingToFileMediaRecorder = new MediaRecorder(mediaStream)
    this.savingToFileName = `${savingToFilesPrefix}_${Date.now()}_${moment().format('YYYY-MM-DD_HH-mm-ss')}.mp4`

    const fileReader = useStreamSaver ? new FileReader() : null
    const fileStream = useStreamSaver ? createWriteStream(`${savingToFilesPrefix}_${Date.now()}_${moment().format('YYYY-MM-DD_HH-mm-ss')}.mp4`) : null
    if (useStreamSaver) {
      this.savingToFileChunks = Promise.resolve()
      this.savingToFileFileStreamWriter = fileStream.getWriter()
    }


    this.savingToFileMediaRecorder.start()
    this.props.savingFiles()

    // setTimeout(() => {
    //   this.savingToFileMediaRecorder.pause()
    // }, 2000)

    // setTimeout(() => {
    //   this.closeCurrentFile(false)
    // }, 40000)


    this.savingToFileMediaRecorder.onstart = () => {
      this.savingToFileStatus = 'started'
      console.log('MediaRecorder - onstart')
    }
    this.savingToFileMediaRecorder.onstop = () => {
      console.log('MediaRecorder - onstop')
    }
    this.savingToFileMediaRecorder.onpause = () => {
      console.log('MediaRecorder - onpause')
    }
    this.savingToFileMediaRecorder.onresume = () => {
      console.log('MediaRecorder - onresume')
    }
    this.savingToFileMediaRecorder.ondataavailable = ({ data }) => {
      console.log('MediaRecorder - ondataavailable')
      if (useStreamSaver) {
        this.savingToFileChunks = this.savingToFileChunks.then(() => new Promise(resolve => {
          fileReader.onload = () => {
            this.savingToFileFileStreamWriter.write(new Uint8Array(fileReader.result))
            resolve()
          }
          fileReader.readAsArrayBuffer(data)
        }))
      } else {
        this.fileSaverChunks.push(data)
      }
    }

  }

  rescheduleSplitFileBasedOnTime() {
    if (this.savingToFileStatus !== 'started' && this.props.savingToFilesStrategy !== 'time') {
      return
    }

    let spec = '* * * * *'
    switch (this.props.splitFileTime) {
      case 'on-the-1-min': spec = '* * * * *'; break;
      case 'on-the-2-min': spec = '*/2 * * * *'; break;
      case 'on-the-5-min': spec = '*/5 * * * *'; break;
      case 'on-the-10-min': spec = '*/10 * * * *'; break;
      case 'on-the-30-min': spec = '*/30 * * * *'; break;
      case 'on-the-hour': spec = '0 * * * *'; break;
      default: spec = '* * * * *'
    }

    if (this.splitFileBasedOnTimeScheduleJob == null) {
      console.log('Schedule a split based on time:', spec)
      this.splitFileBasedOnTimeScheduleJob = schedule.scheduleJob(spec, () => this.closeCurrentFile(true))
    } else {
      console.log('Rechedule a split based on time:', spec)
      this.splitFileBasedOnTimeScheduleJob.reschedule(spec)
    }
  }

  cancelSplitFileBasedOnTimeSchedule() {
    if (this.splitFileBasedOnTimeScheduleJob != null) {
      console.log('Cancel a split based on time')
      this.splitFileBasedOnTimeScheduleJob.cancel()
      this.splitFileBasedOnTimeScheduleJob = null
    }
  }

  componentDidMount() {
    this.rescheduleSplitFileBasedOnTime()
  }

  componentDidUpdate(prevProps) {
    const {
      savingToFiles,
      savingToFilesOnlyMotionDetected,
      savingToFilesStrategy,
      splitFileTime,
      motioning,
    } = this.props

    const userSwitchOnSavingToFiles = !prevProps.savingToFiles && savingToFiles
    const userSwitchOffSavingToFiles = prevProps.savingToFiles && !savingToFiles

    const motionDetected = !prevProps.motioning && motioning
    const motionGone = prevProps.motioning && !motioning

    const userCheckSavingToFilesOnlyMotionDetected = !prevProps.savingToFilesOnlyMotionDetected && savingToFilesOnlyMotionDetected
    const userUncheckSavingToFilesOnlyMotionDetected = prevProps.savingToFilesOnlyMotionDetected && !savingToFilesOnlyMotionDetected

    //TODO action: kickOffSavingToFile when stream ready

    if (userSwitchOnSavingToFiles) {
      this.kickOffSavingToFile()
    }

    if (userSwitchOffSavingToFiles) {
      this.closeCurrentFile(false)
    }

    if (savingToFilesOnlyMotionDetected && motionGone) {
      if (savingToFilesStrategy === 'motion-detected') {
        this.closeCurrentFile(false)
      } else {
        this.pauseSavingToFile()
      }
    }

    if (motionDetected) {
      this.resumeOrKickoffSavingToFile()
    }

    if (userUncheckSavingToFilesOnlyMotionDetected) {
      this.resumeOrKickoffSavingToFile()
    }

    if (savingToFilesStrategy !== 'motion-detected' && !motioning && userCheckSavingToFilesOnlyMotionDetected) {
      this.pauseSavingToFile()
    }

    if (prevProps.savingToFilesStrategy !== savingToFilesStrategy || prevProps.splitFileTime !== splitFileTime) {
      this.rescheduleSplitFileBasedOnTime()
    }

    if (prevProps.savingToFilesStrategy !== savingToFilesStrategy && savingToFilesStrategy !== 'time') {
      this.cancelSplitFileBasedOnTimeSchedule()
    }
  }

  componentWillUnmount() {
    this.cancelSplitFileBasedOnTimeSchedule()
  }

  render() {
    return (
      <div></div>
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
  },
  savingFiles: () => {
    dispatch(SAVING_FILES)
  },
  savingComplete: () => {
    dispatch(SAVING_COMPLETE)
  },
  ffmpegStartedProcessingFile: () => {
    dispatch(FFMPEG_STARTED_PROCESSING_FILE)
  },
  ffmpegFinishedProcessingFile: () => {
    dispatch(FFMPEG_FINISHED_PROCESSING_FILE)
  },
})

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SavingToFiles)
)
