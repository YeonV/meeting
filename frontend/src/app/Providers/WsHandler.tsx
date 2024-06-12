"use client";

import { useCallback, useEffect } from "react";
import { useWebSocket } from "next-ws/client";
import { IWsMessage } from "@/types/chat/IMessage";
import { useSnackbar } from "notistack";
import useStore from "@/store/useStore";
import useTranslation from "@/lib/utils";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";

const WsHandler = ({ children }: { children: React.ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();

  // const [readMessages, setReadMessages] = useState<{ message: string; timestamp: number }[]>([])
  const chats = useStore((state) => state.chats);
  const addMessage = useStore((state) => state.addMessage);
  const addChat = useStore((state) => state.addChat);
  const updateChatInfo = useStore((state) => state.updateChatInfo);
  const addReaction = useStore((state) => state.addReaction);
  const removeReaction = useStore((state) => state.removeReaction);
  const displayName = useStore((state) => state.displayName);
  const setDisplayName = useStore((state) => state.setDisplayName);
  const language = useStore((state) => state.language);
  const myCallId = useStore((state) => state.myCallId);
  const { data: session } = useSession();
  const { t } = useTranslation(language);
  const setDialogs = useStore((state) => state.setDialogs);
  const setOtherCallId = useStore((state) => state.setOtherCallId);
  const ws = useWebSocket();

  const onMessage = useCallback(
    (event: MessageEvent<string>) => {
      const eventType = JSON.parse(event.data).type;
      console.log("event type:", eventType);

      if (eventType === "notify") {
        const data = JSON.parse(event.data);
        // console.log(data.variant, data.content)
        enqueueSnackbar(data.content, { variant: data.variant || "info" });
      }
      if (eventType === "videocall") {
        console.log("incoming call:", JSON.parse(event.data));
        if (myCallId !== JSON.parse(event.data).content) {
          setOtherCallId(JSON.parse(event.data).content);
          console.log("setting incomingcall");
        } else {
          ws?.send(
            JSON.stringify({
              type: "videocall-accepted",
              content: myCallId,
              recipients: myCallId,
              msgId: uuidv4(),
              authorAvatar: session?.user.image,
            })
          );
        }
        setDialogs("incomingCall", true);
      }
      if (eventType === "videocall-accepted") {
        console.log("incoming call:", JSON.parse(event.data));
        if (myCallId !== JSON.parse(event.data).content) {
          setOtherCallId(JSON.parse(event.data).content);
          console.log("setting incomingcall");
        }
        setDialogs("incomingCall", true);
      }
      if (eventType === "error") {
        console.log("error:", JSON.parse(event.data));
        if (
          JSON.parse(event.data).content ===
          "Display name already in use. Please choose another one."
        ) {
          setDisplayName("");
        }
      }
      if (eventType === "reaction") {
        const { chatId, reaction, id } = JSON.parse(event.data);
        if (reaction.author !== displayName) {
          addReaction(chatId, id, reaction);
        } else {
        }
      }
      if (eventType === "reactionRemove") {
        const { chatId, reaction, id } = JSON.parse(event.data);
        console.log("reactionRemove:", chatId, id, reaction);
        if (reaction.author !== displayName) {
          removeReaction(chatId, id, reaction);
        } else {
        }
      }
      if (eventType === "chat") {
        const { author, content, recipients, chatId, msgId, authorAvatar } =
          JSON.parse(event.data) as IWsMessage;
        console.table({
          author,
          authorAvatar,
          content,
          recipients: recipients?.join(","),
          chatId,
        });

        if (
          !recipients.includes(displayName) &&
          !recipients.includes("General")
        ) {
          return;
        }
        if (
          chats.filter((c) => c.id === chatId).length === 0 &&
          !recipients.includes("General")
        ) {
          addChat({
            id: chatId,
            name: recipients.join(",") || "General",
            group: recipients.length > 2,
            members: recipients,
            messages: [],
          });
        }
        if (
          chats.filter((c) => c.id === chatId).length > 0 &&
          !recipients.includes("General") &&
          author !== displayName
        ) {
          updateChatInfo(chatId, [
            { name: author, avatar: authorAvatar },
            { name: displayName, avatar: session?.user.image },
          ]);
        }

        if (content !== `${displayName} ${t("has join the chat")}`) {
          addMessage(chatId || "1", {
            id: msgId,
            author: author || "Blade",
            authorAvatar: authorAvatar || null,
            content: content,
            reactions: [],
            recipients: recipients,
          });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chats]
  );

  useEffect(() => {
    ws?.addEventListener("message", onMessage);
    return () => ws?.removeEventListener("message", onMessage);
  }, [onMessage, ws]);

  return children;
};

export default WsHandler;
