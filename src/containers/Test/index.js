import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

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
    this.videoRef = React.createRef()
    this.canvasRef = React.createRef()
    this.state = {
      playBackStyle: 'original',
      frameRatio: 1.3
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
      audio: true,
      video: { facingMode: 'environment', frameRate: 3}
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
    console.log(cv.putText)

    let cap = new cv.VideoCapture(this.videoRef.current)
    let frame = new cv.Mat(height, width, cv.CV_8UC4)
    let fgmask = new cv.Mat(height, width, cv.CV_8UC1)
    let fgbg = new cv.BackgroundSubtractorMOG2(500, 16, true);


    const FPS = frameRate
    function processVideo() {
        try {
            // if (!streaming) {
            //     // clean and stop.
            //     frame.delete(); fgmask.delete(); fgbg.delete();
            //     return;
            // }
            let begin = Date.now();
            // start processing.
            cap.read(frame);
            fgbg.apply(frame, fgmask);
            cv.putText(fgmask, 'fuck', {x: 100, y: 100}, cv.FONT_HERSHEY_SIMPLEX, 5.0, [255, 255, 255, 255])
            cv.imshow('canvasOutput', fgmask);
            console.log(fgmask)
            console.log(cv.countNonZero(fgmask)) // TODO with a threshold then problem solved
            // schedule the next one.
            let delay = 1000/FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
        } catch (err) {
            console.error(err);
        }
    }

    setTimeout(processVideo, 0);
  }

  componentDidMount() {
    this.initiateCamera()
  }

  render() {
    const { classes } = this.props
    const { playBackStyle, frameRatio, width, height } = this.state
    return (
      <div>
        <video style={{[playBackStyle === 'extend' && frameRatio > 1 ? 'width' : 'height']: '100%'}} width={width} height={height} className={classes.bgvOriginal} ref={this.videoRef} loop autoPlay>
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
