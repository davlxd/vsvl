import saveAs from 'file-saver'

export default (loadingTSMarker, loadedTSMarker, blob = null, fileName = '') => {
  loadingTSMarker(Date.now())
  const worker = new Worker("/ffmpeg-worker-mp4.js")
  worker.onmessage = (e) => {
    const msg = e.data
    switch (msg.type) {
    case "ready":
      loadedTSMarker(Date.now())
      if (blob == null) {
        worker.postMessage({type: "run", arguments: ["-version"]})
        break
      }
      const fileReader = new FileReader()
      fileReader.onload = () => {
        worker.postMessage({
          type: "run",
          MEMFS: [{name: "in.mp4", data: new Uint8Array(fileReader.result)}],
          arguments: ['-i', 'in.mp4', '-c', 'copy', 'out.mp4']})
      }
      fileReader.readAsArrayBuffer(blob)
      break
    case "stdout":
      console.log('ffmpeg-worker stdout:', msg.data)
      break
    case "stderr":
      console.log('ffmpeg-worker stderr:', msg.data)
      break
    case 'done':
      console.log('ffmpeg-worker done:', msg.data)
      if (msg.data.MEMFS.length > 0) {
        saveAs(new Blob([msg.data.MEMFS[0].data]), fileName)
      }
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
