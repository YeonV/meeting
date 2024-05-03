import { IReaction } from '@/types/chat/IReaction';
import { Delete } from '@mui/icons-material';
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText, Menu, Popover, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import React from 'react'

type Props = {
  open: boolean,
  anchorEl: any,
  handleClose: () => void,
  reactions: IReaction[],
  handleDelete: (reaction: IReaction) => void
}

const ReactionsPopup = ({
  open,
  anchorEl,
  handleClose,
  handleDelete,
  reactions
}: Props) => {
  const { data: session } = useSession()

  const me = session?.user?.email || session?.user?.name?.replace('#', '-') || 'Anonymous'
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      PaperProps={{ style: { borderRadius: '2rem', minWidth: '400px' } }}
    >
      <Typography sx={{ fontSize: 18, fontWeight: 400, margin: '1.5rem 1.5rem 1rem' }}>Reactions</Typography>
      <Divider sx={{ marginBottom: 1 }} />
      <List>
      {reactions?.map((r, i) => (
        <ListItem key={r.author + r.emoji + i} sx={{ padding: 0}}>
          <ListItemButton onClick={()=> me === r.author ? handleDelete(r) : null}>
          <ListItemAvatar>
            <Avatar>{r.author.charAt(0)}</Avatar>
          </ListItemAvatar>
          {<ListItemText primary={me === r.author ? 'Du' : r.author} secondary={me === r.author ? 'Zum entfernen klicken' : null} />}
          <Typography fontSize={32}>{r.emoji}</Typography>
          </ListItemButton>
        </ListItem>
      ))}
      </List>
    </Popover>
  )
}

export default ReactionsPopup