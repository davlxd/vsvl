import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

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

const bgHeight = () => window.innerHeight

class Test extends Component {
  constructor(props) {
    super(props)
    // this.fileStream = createWriteStream('filename.mp4')
    // this.writer = this.fileStream.getWriter()

    this.videoRef = React.createRef()
    this.canvasRef = React.createRef()
    this.state = {
      playbackDisplayMode: 'original',
      frameRatio: 1.3,
      abort: false, //TEMP
    }
  }

  importOpenCV() {
    const script = document.createElement("script")
    script.src = '/opencv.js'
    script.async = true
    document.body.appendChild(script)
  }

  initiateCamera() {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      // video: { facingMode: 'environment', frameRate: 3}
      video: { facingMode: 'environment', }
    }).then(stream => {
      this.videoRef.current.srcObject = stream
      const {frameRate, height, width} = stream.getVideoTracks()[0].getSettings()
      const frameRatio = width/height
      this.setState({
        frameRate,
        frameRatio,
        height,
        width
      })
      // this.dumpVideoStreamToFile(stream)

      this.motionDetect()

    }).catch(err => {
      this.cameraActivated = false
      console.error(err)
    })
  }

  motionDetect() {
    const { width, height, frameRate } = this.state

    const cv = window.cv

    console.log(cv)

    let cap = new cv.VideoCapture(this.videoRef.current)
    let frame = new cv.Mat(height, width, cv.CV_8UC4)
    let fgmask = new cv.Mat(height, width, cv.CV_8UC1)
    let fgbg = new cv.BackgroundSubtractorMOG2(500, 16, true);


    // setTimeout(() => {
    //   this.setState({
    //     abort: true
    //   })
    // }, 4000)
    //
    // setTimeout(() => {
    //   console.log('asdfasdfasdfdsfa')
    //   this.writer.close()
    // }, 5000)


    const FPS = frameRate
    const processVideo = () => {
        try {
            // if (!streaming) {
            //     // clean and stop.
            //     frame.delete(); fgmask.delete(); fgbg.delete();  TODO this
            //     return;
            // }
            let begin = Date.now();
            // start processing.
            cap.read(frame);
            // fgbg.apply(frame, fgmask);
            // cv.putText(fgmask, 'fuck', {x: 100, y: 100}, cv.FONT_HERSHEY_SIMPLEX, 5.0, [255, 255, 255, 255])
            cv.putText(frame, 'fuck', {x: 100, y: 100}, cv.FONT_HERSHEY_SIMPLEX, 5.0, [255, 255, 255, 255])
            // cv.imshow('canvasOutput', fgmask);
            cv.imshow('canvasOutput', frame);
            // this.writer.write(fgmask.data)

            // console.log(cv.countNonZero(fgmask)) // TODO with a threshold then problem solved
            // schedule the next one.
            let delay = 1000/FPS - (Date.now() - begin);

            if (!this.state.abort) {
              setTimeout(processVideo, delay);
            }
        } catch (err) {
            console.error(err);
        }
    }

    setTimeout(processVideo, 0);
  }


  dumpVideoStreamToFile(mediaStream) {
    let fr = new FileReader
    let mediaRecorder = new MediaRecorder(mediaStream)
    let chunks = Promise.resolve()
    let fileStream = createWriteStream('filename.mp4')
    let writer = fileStream.getWriter()


    mediaRecorder.start()

    setTimeout(event => {
      mediaRecorder.stop()
      setTimeout(() =>
        chunks.then(evt => writer.close())
      , 1000)
    }, 10000)


    mediaRecorder.onstart = () => {
      console.log('---------------------onstart')
    }
    mediaRecorder.onstop = () => {
      console.log('---------------------onstop')
    }
    mediaRecorder.ondataavailable = ({data}) => {
      console.log('---------------------ondataavailable')
  		chunks = chunks.then(() => new Promise(resolve => {
  			fr.onload = () => {
  				writer.write(new Uint8Array(fr.result))
  				resolve()
  			}
  			fr.readAsArrayBuffer(data)
  		}))
  	}

  }

  dumpCanvasToFile() {
    console.log('this.canvasRef.current')

    const { frameRate } = this.state
    console.log(this.canvasRef.current)
    const mediaStream = this.canvasRef.current.captureStream(frameRate)
    const ctx = this.canvasRef.current.getContext('2d')
    const mediaRecorder = new MediaRecorder(mediaStream);
    let chunks = Promise.resolve()
    const fr = new FileReader

  	const fileStream = createWriteStream('filename.mp4')
  	const writer = fileStream.getWriter()


    // start it
      mediaRecorder.start();


      setTimeout(event => {
        mediaRecorder.stop()
        setTimeout(() =>
          chunks.then(evt => writer.close())
        , 1000)
      }, 10000)


      mediaRecorder.onstart = () => {
        console.log('---------------------onstart')
      }
      mediaRecorder.onstop = () => {
        console.log('---------------------onstop')
      }
      mediaRecorder.ondataavailable = ({data}) => {
        console.log('---------------------ondataavailable')
    		chunks = chunks.then(() => new Promise(resolve => {
    			fr.onload = () => {
    				writer.write(new Uint8Array(fr.result))
    				resolve()
    			}
    			fr.readAsArrayBuffer(data)
    		}))
    	}


  }
  componentDidMount() {
    this.initiateCamera()
    this.dumpCanvasToFile()

  }

  render() {
    const { classes } = this.props
    const { playbackDisplayMode, frameRatio, width, height } = this.state
    return (
      <div>
        <video style={{[playbackDisplayMode === 'extend' && frameRatio > 1 ? 'width' : 'height']: '100%'}} width={width} height={height} className={classes.bgvOriginal} ref={this.videoRef} loop autoPlay>
        </video>
        <canvas id='canvasOutput' ref={this.canvasRef} width={width} height={height}></canvas>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Test)
)
