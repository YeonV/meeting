import {
  AppBar,
  Box,
  IconButton,
  TextField,
  Toolbar,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useWebSocket } from "next-ws/client";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Close, SentimentSatisfiedAlt } from "@mui/icons-material";
import useStore from "@/store/useStore";
import { v4 as uuidv4 } from "uuid";
import useTranslation from "@/lib/utils";
import { useSession } from "next-auth/react";

const MessageBar = ({
  rounded,
  emojiOpen,
  setEmojiOpen,
}: {
  rounded?: boolean;
  emojiOpen: boolean;
  setEmojiOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const ws = useWebSocket();
  const theme = useTheme();
  const language = useStore((state) => state.language);
  const { t } = useTranslation(language);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("" as string);
  const activeChat = useStore((state) => state.activeChat);
  const chats = useStore((state) => state.chats);
  const chat = chats.find((c) => c.id === activeChat);
  const { data: session } = useSession();
  const sendMessage = () => {
    if (inputValue !== "") {
      const msg = JSON.stringify({
        type: "chat",
        content: inputValue,
        recipients: chat?.members || ["General"],
        chatId: chat?.id,
        msgId: uuidv4(),
        authorAvatar: session?.user.image,
      });
      ws?.send(msg);
      setInputValue("");
      setEmojiOpen(false);
    }
  };

  return (
    <>
      <EmojiPicker
        autoFocusSearch
        searchPlaceHolder={t("Search")}
        categories={
          [
            {
              category: "suggested",
              name: t("Recently Used"),
            },
            {
              category: "smileys_people",
              name: t("Smileys"),
            },
            {
              category: "animals_nature",
              name: t("Animals"),
            },
            {
              category: "food_drink",
              name: t("Food"),
            },
            {
              category: "activities",
              name: t("Activities"),
            },
            {
              category: "travel_places",
              name: t("Travel"),
            },
            {
              category: "objects",
              name: t("Objects"),
            },
            {
              category: "symbols",
              name: t("Symbols"),
            },
            {
              category: "flags",
              name: t("Flags"),
            },
          ] as any
        }
        style={{ "--epr-emoji-size": "50px" } as any}
        // emojiStyle={'native' as EmojiStyle}
        previewConfig={{ showPreview: false }}
        open={emojiOpen}
        theme={theme.palette.mode as Theme}
        onEmojiClick={(e) => {
          setInputValue((prev) => prev + e.emoji);
          inputRef.current && inputRef.current.focus();
        }}
        width={"100%"}
      />
      <Box
        sx={{ display: "flex", position: "relative", padding: 0, zIndex: 21 }}
      >
        <AppBar
          color="inherit"
          position="sticky"
          style={{ bottom: 0 }}
          sx={{ borderRadius: rounded ? "0 0 12px 12px" : 0 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => {
                setEmojiOpen(!emojiOpen);
              }}
              sx={{ mr: 2 }}
            >
              {emojiOpen ? <Close /> : <SentimentSatisfiedAlt />}
            </IconButton>
            <TextField
              placeholder={t("Type your message")}
              ref={inputRef}
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(event: React.KeyboardEvent) => {
                if (event.key === "Enter") {
                  sendMessage();
                }
              }}
              sx={{
                flexGrow: 1,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[800]
                    : theme.palette.grey[200],
                mr: 1,
                borderRadius: "12px",
                display: "flex",
                justfyContent: "center",
                "& fieldset": { border: "none", borderRadius: "12px" },
              }}
              inputProps={{ style: { height: 12 } }}
            />
            <IconButton
              disabled={inputValue === ""}
              onClick={sendMessage}
              color="primary"
            >
              <SendIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default MessageBar;
