"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Stack } from "@mui/material";
import useStore from "@/store/useStore";
import MessageBar from "./RightPanel/MessageBar";
import History from "./RightPanel/History/History";
import Userlist from "./LeftPanel/Userlist";
import HeaderBar from "./RightPanel/HeaderBar";
import ChatDetail from "./RightPanel/ChatDetail";
import IncomingCall from "../VideoChat/IncomingCall";
import Peer from "peerjs";

const Chat = () => {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const chats = useStore((state) => state.chats);
  const activeChat = useStore((state) => state.activeChat);
  const chat = chats.find((c) => c.id === activeChat);
  const chatDetail = useStore((state) => state.dialogs.chatDetail);
  const boxHeight = useRef<HTMLDivElement>(null);
  const myCallId = useStore((state) => state.myCallId);
  // const setPeerInstance = useStore((state) => state.setPeerInstance);
  // const peerInstance = useStore((state) => state.peerInstance);
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const otherCallId = useStore((state) => state.otherCallId);
  const setMyCallId = useStore((state) => state.setMyCallId);

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const callingVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const generatedCallId = Math.random().toString(36).substring(2);
    console.log("settingmycallid", generatedCallId);
    myCallId === "" && setMyCallId(generatedCallId);
  }, [myCallId, setMyCallId]);

  useEffect(() => {
    if (!chat?.group && myCallId) {
      let peer: Peer;
      if (typeof window !== "undefined") {
        peer = new Peer(myCallId, {
          host: "localhost",
          port: 9000,
          path: "/myapp",
        });
        console.log("PEER:", peer);
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
  }, [myCallId]);
  return (
    <>
      <IncomingCall
        peerInstance={peerInstance}
        setPeerInstance={setPeerInstance}
        callerId="John Doe"
        onAccept={() => {
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
        }}
        onReject={() => {}}
      />
      <Stack
        direction={"row"}
        spacing={0}
        m={3}
        flex={1}
        sx={{ overflow: "hidden" }}
      >
        <Userlist me="YZ" />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minHeight: 500,
            border: "1px solid gray",
            borderLeft: 0,
            p: 0,
            paddingTop: "64px",
            position: "relative",
          }}
          ref={boxHeight}
        >
          <HeaderBar />
          <Box sx={{ zIndex: 22 }}>
            <ChatDetail
              open={chatDetail}
              boxHeight={boxHeight.current?.offsetHeight || 0}
            />
          </Box>
          <History
            emojiOpen={emojiOpen}
            messages={chat?.messages || []}
            group={chat?.group}
          />
          <MessageBar emojiOpen={emojiOpen} setEmojiOpen={setEmojiOpen} />
        </Box>
      </Stack>
    </>
  );
};

export default Chat;
