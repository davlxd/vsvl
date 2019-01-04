export default () => {
  return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
}
