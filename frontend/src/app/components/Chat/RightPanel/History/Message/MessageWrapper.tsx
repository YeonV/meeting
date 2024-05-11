import { Box, useTheme } from '@mui/material'

const MessageWrapper = ({
  invert,
  children,
  minWidth,
  ...rest
}: {
  invert?: boolean
  children: React.ReactNode
  minWidth?: number
}) => {
  const theme = useTheme()
  const grey = theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200]
  return (
    <Box
      sx={{
        minWidth,
        'padding': '0.25rem 1rem',
        'mt': 0.5,
        'position': 'relative',
        'borderRadius': invert ? '12px 0px 12px 12px' : '0px 12px 12px 12px',
        'bgcolor': invert ? theme.palette.primary.main : grey,
        'color': invert ? theme.palette.primary.contrastText : theme.palette.text.primary,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: invert ? '10px 10px 10px 10px' : '0px 10px 10px 0px',
          borderColor: invert
            ? `${theme.palette.primary.main} transparent transparent transparent`
            : `transparent ${grey} transparent transparent`,
          top: 0,
          right: invert ? '-10px' : 'auto',
          left: invert ? 'auto' : '-10px'
        }
      }}
      {...rest}
    >
      {children}
    </Box>
  )
}

export default MessageWrapper