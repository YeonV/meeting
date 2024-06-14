import useTranslation from "@/lib/utils";
import useStore from "@/store/useStore";
import {
  Chat,
  ChatBubble,
  ChatOutlined,
  Mail,
  Person,
  QuestionAnswer,
  Visibility,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  Icon,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { m } from "framer-motion";
import { useSession } from "next-auth/react";
import MotionBox from "../../Motion/Box";

export const Row = ({ icon = <Person />, name = "Yeon", caption = "" }) => {
  return (
    <Stack direction={"row"} spacing={2} alignItems={"center"} mb={2}>
      {caption && (
        <Typography
          textAlign={"right"}
          sx={{ fontSize: 20, fontWeight: 200, minWidth: 200 }}
        >
          {caption}
        </Typography>
      )}
      {icon}
      <Typography sx={{ fontSize: 20, fontWeight: 200 }}>{name}</Typography>
    </Stack>
  );
};
const ChatDetail = ({
  open,
  boxHeight,
}: {
  open: boolean;
  boxHeight: number;
}) => {
  const theme = useTheme();
  const { data: session } = useSession();
  const displayName = useStore((state) => state.displayName);
  const chats = useStore((state) => state.chats);
  const activeChat = useStore((state) => state.activeChat);
  const chat = chats.find((c) => c.id === activeChat);
  const language = useStore((state) => state.language);
  const { t } = useTranslation(language);
  const messages = chats.flatMap((c) => c.messages);
  return (
    <MotionBox
      id="chat-detail"
      initial={false}
      animate={{ y: open ? -64 : -300, opacity: open ? 1 : 0 }}
      transition={{
        y: { type: "spring", bounce: 0 },
        opacity: { duration: 0.2 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: "absolute",
          bottom: 0,
          top: 64,
          width: "100%",
          zIndex: 1101,
          left: 0,
          transition: "left 0.15s ease-in",
          borderRadius: 0,
          height: `calc(${boxHeight}px - 66px)`,
        }}
      >
        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
            borderRadius: 0,
          }}
          elevation={2}
        >
          {
            <Avatar
              sx={{
                border: "10px solid",
                borderColor: theme.palette.background.paper,
                marginTop: 16,
                width: "220px",
                height: "220px",
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.primary.contrastText,
              }}
              src={
                chat?.infos?.find((c) => c.name !== displayName)?.avatar ||
                undefined
              }
            >
              {chat?.group
                ? chat?.name.charAt(0)
                : chat?.infos
                    ?.find((c) => c.name !== displayName)
                    ?.name.charAt(0)}
            </Avatar>
          }
        </Paper>
        <Box sx={{ mt: 8, padding: 4, color: "#999" }}>
          <Box
            sx={{
              mb: 5,
              fontSize: 32,
              fontWeight: 400,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {chat?.group
              ? chat.name
              : chat?.infos?.find((c) => c.name !== displayName)?.name}
          </Box>
          {
            <>
              <Row
                icon={<ChatOutlined color="inherit" sx={{ fontSize: 40 }} />}
                name={
                  chat?.messages.length.toString() +
                  " " +
                  (chat?.messages?.length || 0 > 1
                    ? t("Messages")
                    : t("Message"))
                }
              />
            </>
          }
        </Box>
      </Paper>
    </MotionBox>
  );
};

export default ChatDetail;
