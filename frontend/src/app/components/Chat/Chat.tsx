"use client";

import { Box, Button, CssBaseline, Toolbar, useMediaQuery } from "@mui/material";
import { ChatAppBar, ChatContainer, ChatDrawer, ChatDrawerHeader, DrawerButton } from './ChatDrawer/ChatDrawer';
import { useEffect, useRef, useState } from "react";
import Userlist, { UserHeader } from "./LeftPanel/Userlist";
import IncomingCall from '../VideoChat/IncomingCall';
import MessageBar from "./RightPanel/MessageBar";
import ChatHeader from "./RightPanel/ChatHeader";
import ChatDetail from "./RightPanel/ChatDetail";
import useStore from "@/store/useStore";
import History from "./RightPanel/History/History";

const Chat = () => {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const drawerWidth = isMobile ? '100%' : '450px'
  const [open, setOpen] = useState(!isMobile);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const chats = useStore((state) => state.chats);
  const activeChat = useStore((state) => state.activeChat);
  const chat = chats.find((c) => c.id === activeChat);
  const chatDetail = useStore((state) => state.dialogs.chatDetail);
  const boxHeight = useRef<HTMLDivElement>(null);
  const myCallId = useStore((state) => state.myCallId);
  const setMyCallId = useStore((state) => state.setMyCallId);

  useEffect(() => {
    const generatedCallId = Math.random().toString(36).substring(2);
    myCallId === "" && setMyCallId(generatedCallId);
  }, [myCallId, setMyCallId]);

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("Browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }
  }, []);




  return (
    <>
      <IncomingCall />
      <Box sx={{ display: 'flex', paddingTop: '60px' }}>
        <CssBaseline />
            
        <ChatAppBar drawerWidth={drawerWidth} open={open} sx={{ marginTop: isMobile ? '57px' : '74px', left: 0 }} position="fixed" >
          <Toolbar>
            <DrawerButton open={open} setOpen={setOpen} />
            <ChatHeader drawerWidth={drawerWidth} open={open} />
          </Toolbar>
        </ChatAppBar>
        <ChatDrawer drawerWidth={drawerWidth} open={open}>
          <ChatDrawerHeader>
            <UserHeader />
          </ChatDrawerHeader>
          <Userlist onUserClick={() => isMobile && setOpen(false)} />
        </ChatDrawer>
        <ChatContainer open={open} drawerWidth={drawerWidth} boxHeight={boxHeight}>
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
        </ChatContainer>
      </Box>
    </>
  );
}

export default Chat;