export default class {
  constructor(funcOnPreq, funcOn, funcOffPreq, funcOff, DELAY_IN_MS, logging=false) {
    this.funcOnPreq = funcOnPreq
    this.funcOn = funcOn
    this.funcOffPreq = funcOffPreq
    this.funcOff = funcOff
    this.DELAY_IN_MS = DELAY_IN_MS
    this.logging = logging
    this.timeoutHandle = null
  }

  log(...arg) {
    if (this.logging) console.log(...arg)
  }

  get handle() {
    return this.timeoutHandle
  }

  on() {
    if (this.funcOnPreq()) {
      this.log('executing on')
      this.funcOn()
    }
    if (this.timeoutHandle != null) {
      this.log('cancel scheduled off')
      clearTimeout(this.timeoutHandle)
      this.timeoutHandle = null
    }
  }

  off() {
    if (!this.funcOffPreq() || this.timeoutHandle != null) {
      return
    }
    this.log('scheduling a delayed off')
    this.timeoutHandle = setTimeout(() => {
      this.log('executing previously scheduled off')
      this.timeoutHandle = null
      if (this.funcOffPreq()) {
        this.log('executing off')
        this.funcOff()
      }
    }, this.DELAY_IN_MS)
  }
}
