import onAndDelayOff from './on-and-delay-off'


describe('User manipulate saving to files', () => {
    it('Initial savingToFiles was off, user switch on, since by default savingToFilesOnlyMotionDetected is on ' + 
    'and savingToFilesStrategy is time, so the behaviour should be: ' +
    'Kick off a savingToFile process, create a new file when on the time, pause when no motion.', () => {})
    

    it('Continue from above, if there is no motion during new file creation, then not create a new file', () => {})


    it('Continue from above, if motion detected, then kick off a savingToFile process', () => {})
    

    it('Continue from above, the user uncheck savingToFilesOnlyMotionDetected, the behaviour should be: ' +
    'Keep recording, only create a new file when on the time' +
    'If it was recording, nothing happens,' +
    'If it was pause, then resume' + 
    'If no recording, then kick off new savingToFile process', () => {})


    it('Continue from above, the user check back savingToFilesOnlyMotionDetected, the behaviour should be: ' +
    'Pause if there is no motion', () => {})


    it('User change savingToFilesStrategy to motion-detected, when savingToFiles process started, ' +
    'motion Gone will close the file', () => {})


    it('Continue from above, when motion is detected, will kick off a new savingToFiles process: ',  () => {})


    it('User switch off savingToFiles was off, close the file if there is a savingToFile process.', () => {})
})
