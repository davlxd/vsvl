import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import saveAs from 'file-saver'

import { SAVING_FILES, SAVING_COMPLETE, NEW_FFMPEG_WORK, FFMPEG_WORK_FINISHED, FFMPEG_WORK_UPDATE_PROGRESS } from '../../actions'

import UseVlcSnack from '../UseVlcSnack'

import FFmpegWorker from './ffmpeg-worker'

const moment = require('moment')
const schedule = require('node-schedule')

class SavingToFiles extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()

    this.splitFileBasedOnTimeScheduleJob = null

    this.savingToFileStatus = 'closed'
    this.savingToFileStartingTS = 0
    this.savingToFileFinishedTS = 0
    this.savingToFileName = ''
    this.savingToFileMediaRecorder = null
    this.savingToFileChunks = null
    this.savingToFileFileStreamWriter = null

    this.fileSaverChunks = []

    this.ffmpegLoadTime = Infinity

    this.state = {
      putOnUseVlcSnack: false,
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

    setTimeout(
      () => {
        const savingToFileNameCopy = this.savingToFileName
        const fileSaverChunksCopy = this.fileSaverChunks.slice(0)
        const savingToFileDuration = this.savingToFileFinishedTS - this.savingToFileStartingTS
        if (!this.props.savingRawVideoFiles) {
          console.log('ffmpeg-worker is ready and not rawing, use it')
          new FFmpegWorker(
            ts => {
              this.ffmpegLoadTime = ts
              console.log('FFmpeg library loaded time: ', ts)
            },
            new Blob(fileSaverChunksCopy),
            savingToFileNameCopy,
            savingToFileDuration,
            id => this.props.newFFmpegWorkStarted(id),
            (id, percentage) => this.props.ffmpegWorkUpdateProgress(id, percentage),
            id => this.props.ffmpegWorkFinished(id)
          )
        } else {
          console.log('ffmpeg-worker is not ready, or rawing, dump directly')
          saveAs(new Blob(fileSaverChunksCopy, { 'type' : 'video/mp4' }), savingToFileNameCopy)
          this.setState({
            putOnUseVlcSnack: true
          })
          new FFmpegWorker(ts => {
            this.ffmpegLoadTime = ts
            console.log('FFmpeg library loaded time: ', ts)
          })
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
    if (this.props.canvasRef.current == null) {
      return
    }

    this.savingToFileStatus = 'starting'
    console.log('! Kicking off a savingToFile')

    const mediaStream = this.props.canvasRef.current.captureStream(frameRate)
    this.savingToFileMediaRecorder = new MediaRecorder(mediaStream)
    this.savingToFileName = `${savingToFilesPrefix}_${Date.now()}_${moment().format('YYYY-MM-DD_HH-mm-ss')}.mp4`

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
      this.savingToFileStartingTS = Date.now()
      console.log('MediaRecorder - onstart')
    }
    this.savingToFileMediaRecorder.onstop = () => {
      this.savingToFileFinishedTS = Date.now()
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
      this.fileSaverChunks.push(data)
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
    new FFmpegWorker(ts => {
      this.ffmpegLoadTime = ts
      console.log('FFmpeg library loaded time: ', ts)
    })
    this.rescheduleSplitFileBasedOnTime()
  }

  componentDidUpdate(prevProps) {
    const {
      savingToFiles,
      savingToFilesOnlyMotionDetected,
      savingToFilesStrategy,
      splitFileTime,
      streamReady,
      motioning,
    } = this.props

    const streamBecomeReady = !prevProps.streamReady && streamReady

    const userSwitchOnSavingToFiles = !prevProps.savingToFiles && savingToFiles
    const userSwitchOffSavingToFiles = prevProps.savingToFiles && !savingToFiles

    const motionDetected = !prevProps.motioning && motioning
    const motionGone = prevProps.motioning && !motioning

    const userCheckSavingToFilesOnlyMotionDetected = !prevProps.savingToFilesOnlyMotionDetected && savingToFilesOnlyMotionDetected
    const userUncheckSavingToFilesOnlyMotionDetected = prevProps.savingToFilesOnlyMotionDetected && !savingToFilesOnlyMotionDetected

    if (streamBecomeReady) {
      this.kickOffSavingToFile()
    }

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
    const {putOnUseVlcSnack, } = this.state

    return (
      <div>
        <UseVlcSnack on={putOnUseVlcSnack} off={() => {}} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  ...state.settings,
  ...state.streaming
})

const mapDispatchToProps = (dispatch) => ({
  savingFiles: () => {
    dispatch(SAVING_FILES)
  },
  savingComplete: () => {
    dispatch(SAVING_COMPLETE)
  },
  // ffmpegStartedProcessingFile: () => {
  //   dispatch(FFMPEG_STARTED_PROCESSING_FILE)
  // },
  // ffmpegFinishedProcessingFile: () => {
  //   dispatch(FFMPEG_FINISHED_PROCESSING_FILE)
  // },
  newFFmpegWorkStarted: id => {
    dispatch(NEW_FFMPEG_WORK(id))
  },
  ffmpegWorkFinished: id => {
    dispatch(FFMPEG_WORK_FINISHED(id))
  },
  ffmpegWorkUpdateProgress: (id, percentage) => {
    dispatch(FFMPEG_WORK_UPDATE_PROGRESS(id, percentage))
  }
})

SavingToFiles.propTypes = {
  canvasRef: PropTypes.object.isRequired,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SavingToFiles)
