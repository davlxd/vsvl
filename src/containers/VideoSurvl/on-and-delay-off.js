export default (funcOnPreq, funcOn, funcOffPreq, funcOff, delayOffTimeoutHandleSetter, delayOffTimeoutHandleGetter, DELAY_IN_MS, logging=false) => {
  return {
    on: () => {
      if (funcOnPreq()) {
        if (logging) console.log('executing on')
        funcOn()
      }
      if (delayOffTimeoutHandleGetter() != null) {
        if (logging) console.log('cancel scheduled off')
        clearTimeout(delayOffTimeoutHandleGetter())
        delayOffTimeoutHandleSetter(null)
      }
    },
    off: () => {
      if (!funcOffPreq() || delayOffTimeoutHandleGetter() != null) {
        return
      }
      if (logging) console.log('scheduling a delayed off')
      delayOffTimeoutHandleSetter(
        setTimeout(() => {
          if (logging) console.log('executing previously scheduled off')
          delayOffTimeoutHandleSetter(null)
          if (funcOffPreq) {
            if (logging) console.log('executing off')
            funcOff()
          }
        }, DELAY_IN_MS)
      )
    }
  }
}
