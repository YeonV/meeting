export const stopTracks = () => {
  ;((window as any).streamA as MediaStream)?.getTracks().forEach((track) => {
    track.stop()
  })
  ;((window as any).streamB as MediaStream)?.getTracks().forEach((track) => {
    track.stop()
  })
}
