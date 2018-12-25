import ImmediateOnAndDelayOff from './immediate-on-and-delay-off'

describe('On and Delay Off', () => {
  it('off was delayed', () => {
    let marker = false
    const immediateOnAndDelayOff = new ImmediateOnAndDelayOff(
      () => marker === false,  // funcOnPreq
      () => marker = true,  // funcOn
      () => marker === true,  // funcOffPreq
      () => marker = false,  // funcOff
      3000,  // DELAY_IN_MS
      false // logging
    )

    immediateOnAndDelayOff.on()
    expect(marker).toBeTruthy()
    expect(immediateOnAndDelayOff.handle).toBeNull()
    immediateOnAndDelayOff.off()
    expect(marker).toBeTruthy()
    expect(immediateOnAndDelayOff.handle).toBeGreaterThan(0)
  })

  it('off was delayed and get executed', (done) => {
    let marker = false
    const immediateOnAndDelayOff = new ImmediateOnAndDelayOff(
      () => marker === false,  // funcOnPreq
      () => marker = true,  // funcOn
      () => marker === true,  // funcOffPreq
      () => marker = false,  // funcOff
      3000,  // DELAY_IN_MS
      false // logging
    )

    immediateOnAndDelayOff.on()
    immediateOnAndDelayOff.off()
    setTimeout(() => {
      expect(marker).toBeFalsy()
      expect(immediateOnAndDelayOff.handle).toBeNull()
      done()
    }, 3000)
  })

  it('off will not be executed if funcOffPreq false', (done) => {
    let marker = false
    const immediateOnAndDelayOff = new ImmediateOnAndDelayOff(
      () => marker === false,  // funcOnPreq
      () => setTimeout(() => marker = true, 1000), // funcOn
      () => marker === false,  // funcOffPreq
      () => marker = false,  // funcOff
      3000,  // DELAY_IN_MS
      false // logging
    )

    immediateOnAndDelayOff.on()
    immediateOnAndDelayOff.off()
    setTimeout(() => {
      expect(marker).toBeTruthy()
      expect(immediateOnAndDelayOff.handle).toBeNull()
      done()
    }, 3000)
  })

  it('delayed off can be cancelled', () => {
    let marker = false
    const immediateOnAndDelayOff = new ImmediateOnAndDelayOff(
      () => marker === false,  // funcOnPreq
      () => marker = true,  // funcOn
      () => marker === true,  // funcOffPreq
      () => marker = false,  // funcOff
      3000,  // DELAY_IN_MS
      false // logging
    )

    immediateOnAndDelayOff.on()
    immediateOnAndDelayOff.off()
    immediateOnAndDelayOff.on()
    expect(marker).toBeTruthy()
    expect(immediateOnAndDelayOff.handle).toBeNull()
  })

  it('multiple instance will not affect each other (1st was delayed and get executed, 2nd canceled', (done) => {
    let marker1 = 0
    let marker2 = 0
    const immediateOnAndDelayOff1 = new ImmediateOnAndDelayOff(
      () => true,  // funcOnPreq
      () => marker1 = marker1 + 1,  // funcOn
      () => true,  // funcOffPreq
      () => marker2 = marker2 + 1,  // funcOff
      3000,  // DELAY_IN_MS
      false // logging
    )
    const immediateOnAndDelayOff2 = new ImmediateOnAndDelayOff(
      () => true,  // funcOnPreq
      () => marker1 = marker1 + 1,  // funcOn
      () => true,  // funcOffPreq
      () => marker2 = marker2 + 1,  // funcOff
      3000,  // DELAY_IN_MS
      false // logging
    )

    expect(marker1).toEqual(0)
    expect(marker2).toEqual(0)
    immediateOnAndDelayOff1.on()
    immediateOnAndDelayOff2.on()
    expect(marker1).toEqual(2)
    expect(marker2).toEqual(0)

    immediateOnAndDelayOff1.off()
    immediateOnAndDelayOff2.off()
    expect(marker1).toEqual(2)
    expect(marker2).toEqual(0)

    immediateOnAndDelayOff2.on()
    expect(marker1).toEqual(3)
    expect(marker2).toEqual(0)
    expect(immediateOnAndDelayOff2.handle).toBeNull()

    setTimeout(() => {
      expect(marker1).toEqual(3)
      expect(marker2).toEqual(1)
      expect(immediateOnAndDelayOff1.handle).toBeNull()
      expect(immediateOnAndDelayOff2.handle).toBeNull()
      done()
    }, 3000)
  })

  it('subsequent on will be escaped', () => {
    let marker = 0
    const immediateOnAndDelayOff = new ImmediateOnAndDelayOff(
      () => marker < 1,  // funcOnPreq
      () => marker = marker + 1,  // funcOn
      () => marker >= 0,  // funcOffPreq
      () => marker = 0,  // funcOff
      3000,  // DELAY_IN_MS
      false // logging
    )

    expect(marker).toEqual(0)
    immediateOnAndDelayOff.on()
    expect(marker).toEqual(1)

    immediateOnAndDelayOff.on()
    expect(marker).toEqual(1)

    immediateOnAndDelayOff.on()
    expect(marker).toEqual(1)
  })


  it('subsequent off (before actual execution) will be escaped', () => {
    let marker = 0
    const immediateOnAndDelayOff = new ImmediateOnAndDelayOff(
      () => marker < 1,  // funcOnPreq
      () => marker = marker + 1,  // funcOn
      () => marker >= 0,  // funcOffPreq
      () => marker = 0,  // funcOff
      3000,  // DELAY_IN_MS
      false // logging
    )

    expect(marker).toEqual(0)
    expect(immediateOnAndDelayOff.handle).toBeNull()
    immediateOnAndDelayOff.on()
    expect(marker).toEqual(1)
    expect(immediateOnAndDelayOff.handle).toBeNull()

    immediateOnAndDelayOff.off()
    expect(marker).toEqual(1)
    expect(immediateOnAndDelayOff.handle).toBeGreaterThan(0)
    const handleValue = immediateOnAndDelayOff.handle

    immediateOnAndDelayOff.off()
    expect(marker).toEqual(1)
    expect(immediateOnAndDelayOff.handle).toBeGreaterThan(0)
    expect(immediateOnAndDelayOff.handle).toEqual(handleValue)

    immediateOnAndDelayOff.off()
    expect(marker).toEqual(1)
    expect(immediateOnAndDelayOff.handle).toBeGreaterThan(0)
    expect(immediateOnAndDelayOff.handle).toEqual(handleValue)
  })

  it('subsequent off (after actual execution) will be escaped', (done) => {
    let marker = false
    const immediateOnAndDelayOff = new ImmediateOnAndDelayOff(
      () => marker === false,  // funcOnPreq
      () => marker = true,  // funcOn
      () => marker === true,  // funcOffPreq
      () => marker = false,  // funcOff
      3000,  // DELAY_IN_MS
      false // logging
    )

    immediateOnAndDelayOff.on()
    immediateOnAndDelayOff.off()
    setTimeout(() => {
      expect(marker).toBeFalsy()
      expect(immediateOnAndDelayOff.handle).toBeNull()

      immediateOnAndDelayOff.off()
      expect(immediateOnAndDelayOff.handle).toBeNull()

      immediateOnAndDelayOff.off()
      expect(immediateOnAndDelayOff.handle).toBeNull()
      done()
    }, 3000)
  })

})
