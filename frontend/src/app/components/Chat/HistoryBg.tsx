import { Box } from '@mui/material'

const HistoryBg = () => {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'url(/bg2.png) repeat center center',
        backgroundSize: '70%',
        zIndex: -1,
        opacity: 0.05
      }}
    />
  )
}

export default HistoryBg