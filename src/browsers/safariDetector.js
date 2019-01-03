export default () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
