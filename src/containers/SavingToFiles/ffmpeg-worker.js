import saveAs from 'file-saver'
const moment = require('moment')

let idGenerator = 0

export default class {
  constructor(libLoadedHook = ts => {}, blob = null, fileName = '', duration = 0, startHook = id => {}, updateProgressHook = (id, percentage) => {}, finishHook = id => {}, logging = false) {
    this.libLoadingTS = Date.now()
    this.libLoadedTS = Infinity
    this.id = idGenerator++
    this.logging = logging

    console.log('ffmpeg-work-id:', this.id)
    console.log('ffmpeg-work-duration:', duration)

    const worker = new Worker("/ffmpeg-worker-mp4.js")
    worker.onmessage = (e) => {
      const msg = e.data
      switch (msg.type) {
      case "ready":
        this.libLoadedTS = Date.now()
        libLoadedHook(this.libLoadedTS - this.libLoadingTS)
        if (blob == null) {
          worker.postMessage({type: "run", arguments: ["-version"]})
          break
        }
        const fileReader = new FileReader()
        fileReader.onload = () => {
          worker.postMessage({
            type: "run",
            MEMFS: [{name: "in.mp4", data: new Uint8Array(fileReader.result)}],
            // arguments: ['-i', 'in.mp4', '-c', 'copy', 'out.mp4']})
            arguments: ['-i', 'in.mp4', '-preset', 'veryfast', 'out.mp4']
          })
          startHook(this.id)
        }
        fileReader.readAsArrayBuffer(blob)
        break
      case "stdout":
        console.log('ffmpeg-worker stdout:', msg.data)
        break
      case "stderr":
        console.log('ffmpeg-worker stderr:', msg.data)
        const matched = msg.data.match(/time=(\d\d:\d\d:\d\d.\d\d)/)
        if (matched != null && matched.length > 1) {
          updateProgressHook(this.id, moment.duration(matched[1]).as('milliseconds') / duration)
        }
        break
      case 'done':
        console.log('ffmpeg-worker done:', msg.data)
        if (msg.data.MEMFS.length > 0) {
          saveAs(new Blob([msg.data.MEMFS[0].data]), fileName)
        }
        finishHook(this.id)
        worker.terminate()
        break
      case "exit":
        console.log("ffmpeg-worker Process exited with code " + msg.data)
        worker.terminate()
        break
      default:
        console.log('ffmpeg-worker onmessage case:', msg.type)
      }
    }
  }

  log(...arg) {
    if (this.logging) console.log(...arg)
  }

  get loadingTime() {
    return this.libLoadedTS - this.libLoadingTS
  }
}
