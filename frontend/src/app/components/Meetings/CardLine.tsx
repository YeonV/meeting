import { Typography } from '@mui/material'

const CardLine = ({ label, value }: { label: string; value: string }) => (
  <Typography color='text.secondary' sx={{ fontSize: 14, justifyContent: 'space-between', display: 'flex' }} component='div'>
    <span>{label}:</span> {value}
  </Typography>
)

export default CardLine
