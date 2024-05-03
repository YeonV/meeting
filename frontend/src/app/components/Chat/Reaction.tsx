import { Badge, Box, IconButton, useTheme } from '@mui/material'
import ReactionsPopup from './ReactionsPopup'
import { useState } from 'react'
import { IReaction } from '@/types/chat/IReaction'
import useStore from '@/store/useStore'
import { useWebSocket } from 'next-ws/client'

const Reaction = ({
  invert,
  emoji,
  i,
  reactions,
  chatId,
  messageId,
  count
}: {
  invert: boolean,
  emoji: string,
  i: number,
  reactions: IReaction[],
  chatId: string,
  messageId: string,
  count: number
}) => {
  const ws = useWebSocket()

  const theme = useTheme()
  const grey = theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200]
  const removeReaction = useStore((state) => state.removeReaction)

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const open = Boolean(anchorEl)
  // const id = open ? 'simple-popover' : undefined

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <>
      <Box
        sx={{
          bgcolor: invert ? theme.palette.primary.main : grey
          // pointerEvents: 'none'
        }}
      >
        <IconButton
          onClick={handleClick}
          sx={{
            'position': 'absolute',
            'right': i * 35,
            'backgroundColor': grey,
            '&: hover': {
              backgroundColor: grey
            },
            'border': '1px solid #111',
            'padding': 0.5,
            width: 35,
            height: 35,
            fontSize: 16,
          }}
        >
          {emoji}
          {count > 1 && <Badge color='primary' sx={{ position: 'absolute', right: 4, bottom: 0 }} badgeContent={count} anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} />}
        </IconButton>
      </Box>
      <ReactionsPopup
        handleDelete={(r) => {
          removeReaction(chatId, messageId, r)
          ws?.send(
            JSON.stringify({
              type: 'reactionRemove',
              chatId: chatId,
              id: messageId,
              reaction: r
            })
          )
        }}
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
        reactions={reactions}
      />

    </>
  )
}

export default Reaction