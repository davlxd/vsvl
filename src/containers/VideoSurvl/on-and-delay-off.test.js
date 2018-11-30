import onAndDelayOff from './on-and-delay-off'


describe('On and Delay Off', () => {
  it('off was delayed', () => {
    let marker = false
    let handler = null
    const { on, off } = onAndDelayOff(
      () => marker === false,  // funcOnPreq
      () => marker = true,  // funcOn
      () => marker === true,  // funcOffPreq
      () => marker = false,  // funcOff
      handleValue => handler = handleValue,  // delayOffTimeoutHandleSetter
      () => handler,  // delayOffTimeoutHandleGetter
      3000,  // DELAY_IN_MS
      false // logging
    )

    on()
    expect(marker).toBeTruthy()
    expect(handler).toBeNull()
    off()
    expect(marker).toBeTruthy()
    expect(handler).toBeGreaterThan(0)
  })

  it('off was delayed and get executed', (done) => {
    let marker = false
    let handler = null
    const { on, off } = onAndDelayOff(
      () => marker === false,  // funcOnPreq
      () => marker = true,  // funcOn
      () => marker === true,  // funcOffPreq
      () => marker = false,  // funcOff
      handleValue => handler = handleValue,  // delayOffTimeoutHandleSetter
      () => handler,  // delayOffTimeoutHandleGetter
      3000,  // DELAY_IN_MS
      false // logging
    )

    on()
    off()
    setTimeout(() => {
      expect(marker).toBeFalsy()
      expect(handler).toBeNull()
      done()
    }, 3000)
  })

})
