import iOSDetector from './iOSDetector'

export default () => {
  return iOSDetector() && navigator.userAgent.match('CriOS')
}
