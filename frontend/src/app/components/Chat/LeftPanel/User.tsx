import useTranslation from "@/lib/utils";
import useStore from "@/store/useStore";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import moment from "moment";
import { useSession } from "next-auth/react";

const User = ({
  name,
  id,
  lastMessage: { author, content, time },
  group,
  onUserClick
}: {
  name: string;
  id?: string;
  lastMessage: {
    author: string;
    content: string;
    time?: number;
  };
  group?: boolean;
  onUserClick?: (id: string) => void;
}) => {
  const { data: session } = useSession();

  const theme = useTheme();
  const language = useStore((state) => state.language);
  const { t } = useTranslation(language);
  const activeChat = useStore((state) => state.activeChat);
  const chats = useStore((state) => state.chats);
  const displayName = useStore((state) => state.displayName);
  const chat = chats.find((c) => c.id === id);
  const otherUser = chat?.members?.find((m) => m !== displayName);
  const setActiveChat = useStore((state) => state.setActiveChat);
  const setOtherCallId = useStore((state) => state.setOtherCallId);
  const timeFromNow = moment(time).fromNow();
  const formattedDate = moment(time).format("DD.MM.YYYY, hh:mm");
  const displayTime =
    moment().diff(moment(time), "days") <= 2 ? timeFromNow : formattedDate;
  // console.log("Otheruser:", otherUser);
  return (
    <Box
      key={name}
      onClick={() => {
        setActiveChat(id ? id : "0");
        setOtherCallId(id ? id : "");
        onUserClick && onUserClick(id ? id : "");
      }}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        p: 2,
        cursor: "pointer",
        borderBottom: "1px solid #5555",
        backgroundColor: activeChat === id ? "#5555" : "transparent",
        "&:hover": {
          backgroundColor: "#5553",
        },
      }}
    >
      {/* <Avatar sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.primary.contrastText, mr: 2 }}>{otherUser?.charAt(0)}</Avatar> */}
      <Avatar
        sx={{
          bgcolor: theme.palette.secondary.main,
          color: theme.palette.primary.contrastText,
          mr: 2,
        }}
        src={
          chat?.group
            ? chat?.name
            : chat?.infos?.find((c) => c.name === otherUser)?.avatar ||
              undefined
        }
      >
        {chat?.group ? chat.name?.charAt(0) : otherUser?.charAt(0)}
      </Avatar>
      <Stack direction="column" spacing={0} alignItems="flex-start" flex={1}>
        <Box>{group ? name : otherUser}</Box>
        <Typography color={theme.palette.text.disabled}>{content}</Typography>
      </Stack>
      <Stack direction="column" spacing={0.5} alignItems="flex-end" flex={1}>
        {group && (
          <Typography
            variant="caption"
            textTransform={"uppercase"}
            color={theme.palette.text.disabled}
            sx={{ border: "1px solid", padding: "0 8px", borderRadius: 1 }}
          >
            {t("Group")}
          </Typography>
        )}
        <Typography color={theme.palette.text.disabled}>
          {displayTime}
        </Typography>
      </Stack>
    </Box>
  );
};

export default User;
