import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import useStore from "@/store/useStore";
import Peer from "peerjs";

interface IncomingCallProps {
  callerId: string;
  onAccept: () => void;
  onReject: () => void;
  setPeerInstance: React.Dispatch<React.SetStateAction<Peer | null>>;
  peerInstance: Peer | null;
}

const IncomingCall: React.FC<IncomingCallProps> = ({
  callerId,
  onAccept,
  onReject,
  peerInstance,
  setPeerInstance,
}) => {
  // const [open, setOpen] = useState(true)
  const [ringing, setRinging] = useState(true);
  const open = useStore((state) => state.dialogs.incomingCall);
  const setOpen = useStore((state) => state.setDialogs);
  const otherCallId = useStore((state) => state.otherCallId);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const callingVideoRef = useRef<HTMLVideoElement>(null);
  // const setPeerInstance = useStore((state) => state.setPeerInstance);
  // const peerInstance = useStore((state) => state.peerInstance);
  const myCallId = useStore((state) => state.myCallId);
  const handleClose = () => {
    setOpen("incomingCall", false);
  };

  useEffect(() => {
    const audio = new Audio("/call.mp3"); // Replace with your ringtone path
    let intervalId: any;

    if (ringing) {
      audio.play().catch(() => console.warn("Ringtone failed to play"));
      intervalId = setInterval(
        () => audio.play().catch(() => console.warn("Ringtone failed to play")),
        3000
      );
    }

    return () => {
      clearInterval(intervalId);
      audio.pause();
    };
  }, [ringing]);

  const handleCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const call = peerInstance?.call(otherCallId, stream);
        if (call) {
          call.on("stream", (userVideoStream) => {
            if (callingVideoRef.current) {
              callingVideoRef.current.srcObject = userVideoStream;
            }
          });
        }
      });
  };

  useEffect(() => {
    if (myCallId) {
      let peer: Peer;
      if (typeof window !== "undefined") {
        peer = new Peer(myCallId, {
          host: "localhost",
          port: 9000,
          path: "/myapp",
        });

        setPeerInstance(peer);

        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            if (myVideoRef.current) {
              myVideoRef.current.srcObject = stream;
            }

            peer.on("call", (call) => {
              call.answer(stream);
              call.on("stream", (userVideoStream) => {
                if (callingVideoRef.current) {
                  callingVideoRef.current.srcObject = userVideoStream;
                }
              });
            });
          });
      }

      return () => {
        if (peer) {
          peer.destroy();
        }
      };
    }
  }, [myCallId, setPeerInstance]);

  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Dialog open={open && otherCallId !== ""} onClose={handleClose}>
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <motion.div
          animate={{ scale: ringing ? [1.3, 1] : 1 }}
          transition={{ duration: 0.5, repeat: ringing ? Infinity : 1 }}
        >
          <Avatar sx={{ mr: 2 }}>
            {/* Display caller's avatar here (if available) */}
          </Avatar>
        </motion.div>
        <Typography variant="h6">{callerId} is calling</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Would you like to accept the call?
        </DialogContentText>

        <Paper
          sx={{
            padding: 3,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Your ID: {myCallId}</Typography>
              <video
                playsInline
                ref={myVideoRef}
                autoPlay
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                onClick={handleCall}
                disabled={!otherCallId || otherCallId === ""}
              >
                Call
              </Button>
              <video
                playsInline
                ref={callingVideoRef}
                autoPlay
                style={{ width: "100%" }}
              />
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={onReject}>
          Reject
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setRinging(false);
            onAccept();
          }}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncomingCall;
