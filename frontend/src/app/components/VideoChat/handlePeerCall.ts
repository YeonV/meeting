import Peer from 'peerjs'
import { RefObject } from 'react'

export const handlePeerCall = (peer: Peer, stream: MediaStream, callingVideoRef: RefObject<HTMLVideoElement>, callId: string) => {
  const call = peer.call(callId, stream)
  if (call) {
    call.answer(stream)
    call.on('stream', (userVideoStream) => {
      if (callingVideoRef.current) {
        callingVideoRef.current.srcObject = userVideoStream
      }
    })
  }
}
