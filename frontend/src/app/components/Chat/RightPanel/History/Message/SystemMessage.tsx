import { Box, Stack, Typography, useTheme } from '@mui/material'

const SystemMessage = ({
  content
}: {
  content: string
}) => {
  const trimmedContent = content.trim()
  const theme = useTheme()
  return (
    <Stack direction='row' margin={'0 auto'} spacing={2} justifyContent={'center'} alignItems={'center'}>
      <Box
        sx={{
          padding: '0.25rem 1rem',
          borderRadius: '12px',
          bgcolor:  theme.palette.mode === 'dark' ? '#292929': '#f5f5f5',
          color: '#999'
        }}
      >
        <Typography fontSize={14} fontWeight={500}>{trimmedContent}</Typography>
      </Box>
    </Stack>
  )
}

export default SystemMessage