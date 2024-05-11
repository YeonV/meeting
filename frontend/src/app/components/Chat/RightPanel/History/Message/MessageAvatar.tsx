import { Avatar, useTheme } from '@mui/material'

const MessageAvatar = ({
  author,
  onClick
}: {
  author: string,
  onClick?: () => void
}) => {
  const theme = useTheme()
  return (
    <Avatar
      onClick={onClick}
      sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.primary.contrastText, mr: 2, cursor: 'pointer' }}
    >
      {author.charAt(0)}
    </Avatar>
  )
}

export default MessageAvatar