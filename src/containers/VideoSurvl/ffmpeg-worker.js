import saveAs from 'file-saver'

export default (loadingTSMarker, loadedTSMarker, array = null, fileName = '') => {
  let stdout = ''
  let stderr = ''
  loadingTSMarker(Date.now())
  const worker = new Worker("/ffmpeg-worker-mp4.js")
  worker.onmessage = (e) => {
    const msg = e.data
    switch (msg.type) {
    case "ready":
      loadedTSMarker(Date.now())
      if (array == null) {
        worker.postMessage({type: "run", arguments: ["-version"]})
        break
      }
      // const fileReader = new FileReader()
      // fileReader.onload = () => {
      //   worker.postMessage({
      //     type: "run",
      //     MEMFS: [{name: "in.mp4", data: new Uint8Array(fileReader.result)}],
      //     arguments: ['-i', 'in.mp4', '-c', 'copy', 'out.mp4']})
      // }
      // fileReader.readAsArrayBuffer(blob)
      //
      worker.postMessage({
        type: "run",
        MEMFS: [{name: "in.mp4", data: array}],
        arguments: ['-i', 'in.mp4', '-c', 'copy', 'out.mp4']
      })
      break
    case "stdout":
      console.log('stdout!!!!!!!!!!!!!!!!')
      stdout += msg.data + "\n"
      break
    case "stderr":
      console.log('stderr!!!!!!!!!!!!!!!!')
      stderr += msg.data + "\n"
      break
    case 'done':
      console.log('done!!!!!!!!!!!!!!!!')
      console.log(msg.data)
      console.log(msg.data.MEMFS)
      console.log(msg.data.MEMFS[0])
      // saveAs(new Blob(msg.data.MEMFS[0].data, { 'type' : 'video/mp4' }), fileName)
      saveAs(Buffer(msg.data.MEMFS[0].data), fileName)
      break
    case "exit":
      console.log("Process exited with code " + msg.data)
      console.log(stdout)
      if (stderr) console.error(stderr)
      worker.terminate()
      break
    default:
      console.log('case', msg.type)
    }
  }
}
