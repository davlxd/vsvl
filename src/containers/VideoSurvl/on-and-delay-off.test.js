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

  it('off will not be executed if funcOffPreq false', (done) => {
    let marker = false
    let handler = null
    const { on, off } = onAndDelayOff(
      () => marker === false,  // funcOnPreq
      () => setTimeout(() => marker = true, 1000), // funcOn
      () => marker === false,  // funcOffPreq
      () => marker = false,  // funcOff
      handleValue => handler = handleValue,  // delayOffTimeoutHandleSetter
      () => handler,  // delayOffTimeoutHandleGetter
      3000,  // DELAY_IN_MS
      true // logging
    )

    on()
    off()
    setTimeout(() => {
      expect(marker).toBeTruthy()
      expect(handler).toBeNull()
      done()
    }, 3000)
  })

  it('delayed off can be cancelled', () => {
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
    on()
    expect(marker).toBeTruthy()
    expect(handler).toBeNull()
  })

  it('subsequent on will be escaped', () => {
    let marker = 0
    let handler = null
    const { on, off } = onAndDelayOff(
      () => marker < 1,  // funcOnPreq
      () => marker = marker + 1,  // funcOn
      () => marker >= 0,  // funcOffPreq
      () => marker = 0,  // funcOff
      handleValue => handler = handleValue,  // delayOffTimeoutHandleSetter
      () => handler,  // delayOffTimeoutHandleGetter
      3000,  // DELAY_IN_MS
      false // logging
    )

    expect(marker).toEqual(0)
    on()
    expect(marker).toEqual(1)

    on()
    expect(marker).toEqual(1)

    on()
    expect(marker).toEqual(1)
  })


  it('subsequent off (before actual execution) will be escaped', () => {
    let marker = 0
    let handler = null
    const { on, off } = onAndDelayOff(
      () => marker < 1,  // funcOnPreq
      () => marker = marker + 1,  // funcOn
      () => marker >= 0,  // funcOffPreq
      () => marker = 0,  // funcOff
      handleValue => handler = handleValue,  // delayOffTimeoutHandleSetter
      () => handler,  // delayOffTimeoutHandleGetter
      3000,  // DELAY_IN_MS
      false // logging
    )

    expect(marker).toEqual(0)
    expect(handler).toBeNull()
    on()
    expect(marker).toEqual(1)
    expect(handler).toBeNull()

    off()
    expect(marker).toEqual(1)
    expect(handler).toBeGreaterThan(0)
    const handleValue = handler

    off()
    expect(marker).toEqual(1)
    expect(handler).toBeGreaterThan(0)
    expect(handler).toEqual(handleValue)

    off()
    expect(marker).toEqual(1)
    expect(handler).toBeGreaterThan(0)
    expect(handler).toEqual(handleValue)
  })

  it('subsequent off (after actual execution) will be escaped', (done) => {
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

      off()
      expect(handler).toBeNull()

      off()
      expect(handler).toBeNull()
      done()
    }, 3000)
  })

})
