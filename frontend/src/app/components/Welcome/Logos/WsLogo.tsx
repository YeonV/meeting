import { Box } from '@mui/material'

const WsLogo = () => {
  return (
    <Box
      sx={{
        borderRadius: '50%',
        bgcolor: '#000000',
        height: 84,
        width: 84,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg width='56' height='42' viewBox='0 0 256 193' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid'>
        <path
          d='M192.44 144.645h31.78V68.339l-35.805-35.804-22.472 22.472 26.497 26.497v63.14zm31.864 15.931H113.452L86.954 134.08l11.237-11.236 21.885 21.885h45.028l-44.357-44.441 11.32-11.32 44.357 44.358V88.296l-21.801-21.801 11.152-11.153L110.685 0H0l31.696 31.696v.084H97.436l23.227 23.227-33.96 33.96L63.476 65.74V47.712h-31.78v31.193l55.007 55.007L64.314 156.3l35.805 35.805H256l-31.696-31.529z'
          fill={'#FFFFFF'}
        />
      </svg>
    </Box>
  )
}

export default WsLogo
