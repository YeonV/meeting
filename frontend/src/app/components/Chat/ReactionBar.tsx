import useStore from '@/store/useStore'
import { Close, SentimentSatisfiedAlt } from '@mui/icons-material'
import { IconButton, Stack, useTheme } from '@mui/material'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import HoverPopover from 'material-ui-popup-state/HoverPopover'
import { useSession } from 'next-auth/react'
import { useWebSocket } from 'next-ws/client'
import { useState } from 'react'

const ReactionBar = ({
  msgId,
  popupState,
  bindPopover,
  invert
}: {
  msgId: string,
  popupState: any,
  bindPopover: any,
  invert?: boolean

}) => {
  const theme = useTheme()
  const ws = useWebSocket()
  const { data: session } = useSession()


  const [reactionOpen, setReactionOpen] = useState(false)
  const addReaction = useStore((state) => state.addReaction)
  const removeReaction = useStore((state) => state.removeReaction)
  const chats = useStore((state) => state.chats)
  const activeChat = useStore((state) => state.activeChat)

  return (
    <HoverPopover
      {...bindPopover(popupState)}
      anchorOrigin={{
        vertical: 'center',
        horizontal: invert ? 'left' : 'right'
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: invert ? 'right' : 'left'
      }}
      PaperProps={{ style: { borderRadius: '2rem', paddingLeft: 16, paddingRight: 16, background: 'transparent' } }}
    >
      <Stack direction='row' spacing={1} justifyContent='center' alignItems='center'>
        <IconButton onClick={() => setReactionOpen(!reactionOpen)}>
          {reactionOpen ? <Close sx={{ fontSize: '20px' }} /> : <SentimentSatisfiedAlt sx={{ fontSize: '24px' }} />}
        </IconButton>
        <EmojiPicker
          autoFocusSearch
          style={{ '--epr-emoji-size': '20px' } as any}
          reactionsDefaultOpen={true}
          previewConfig={{ showPreview: false }}
          open={reactionOpen}
          theme={theme.palette.mode as Theme}
          onEmojiClick={(e) => {
            const r = {
              emoji: e.emoji,
              author: session?.user?.email || session?.user?.name?.replace('#', '-') || 'Anonymous'
            }
            const emojiAlreadyExists =
              chats
                ?.find((c) => c.id === activeChat)?.messages
                ?.find((m) => m.id === msgId)?.reactions
                ?.some((re) => re.emoji === r.emoji && re.author === r.author) || false

            if (!emojiAlreadyExists) {
              addReaction(activeChat, msgId, r)
            } else {
              removeReaction(activeChat, msgId, r)
            }
            ws?.send(
              JSON.stringify({
                type: emojiAlreadyExists ? 'reactionRemove' : 'reaction',
                chatId: activeChat,
                id: msgId,
                reaction: r
              })
            )
          }}
          width={'100%'}
        />
      </Stack>
    </HoverPopover>
  )
}

export default ReactionBar